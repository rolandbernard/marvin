
import { app } from 'electron';
import { readFile, writeFile, stat, readdir } from 'fs/promises';
import { join, basename, extname } from 'path';

import { Application } from 'main/adapters/applications/applications';
import { CommandMode, executeCommand } from 'main/adapters/commands';
import { openFile } from 'main/adapters/file-handler';
import { unique } from 'common/util';

export function getDefaultDirectoriesWinows(): string[] {
    return [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        join(app.getPath('home'), 'AppData\\Roaming\\Microsoft\\Windows\\Start Menu'),
        join(app.getPath('home'), 'Desktop'),
    ];
}

let loaded = false;
let applications: Application[] = [];

const APPLICATION_CACHE_FILENAME = 'applications.json';
const CACHE_PATH = join(app.getPath('userData'), APPLICATION_CACHE_FILENAME);

async function loadApplicationCache() {
    if (!loaded) {
        try {
            applications = JSON.parse(await readFile(CACHE_PATH, { encoding: 'utf8' }));
            loaded = true;
        } catch (e) { /* Ignore errors */ }
    }
}

async function updateCache() {
    try {
        await writeFile(CACHE_PATH, JSON.stringify(applications), { encoding: 'utf8' });
    } catch (e) { /* Ignore errors */  }
}

async function loadUWPApplications(directories: string[]): Promise<Application[]> {
    const script = `
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'
$apps = Get-StartApps | Where-Object { $_.AppID.Contains("!") }
function FindLogoFilePath($logoFilePath) {
    if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
        return $logoFilePath
    }
    $filePath = Get-ChildItem $logoFilePath.Replace(".png", ".scale-*.png") |
        Sort-Object -Property Name |
        Select-Object -First 1 -ExpandProperty FullName
    if ($filePath -ne $null) {
        $logoFilePath = $filePath
    }
    if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
        return $logoFilePath
    }
    $filePath = Get-ChildItem $logoFilePath.Replace(".png", ".targetsize-*.png") |
        Where-Object { ($_.Name -match "targetsize-(\\d+)\\.png") -and ($Matches[1] -ge 48) } |
        Sort-Object -Property Name |
        Select-Object -First 1 -ExpandProperty FullName
    if ($filePath -ne $null) {
        $logoFilePath = $filePath
    }
    if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
        return $logoFilePath
    }
    $filePath = Get-ChildItem $logoFilePath.Replace(".png", ".targetsize-*.png") |
        Where-Object { ($_.Name -match "targetsize-(\\d+).*\\.png") -and ($Matches[1] -ge 48) } |
        Sort-Object -Property Name |
        Select-Object -First 1 -ExpandProperty FullName
    if ($filePath -ne $null) {
        $logoFilePath = $filePath
    }
    if ([System.IO.File]::Exists($logoFilePath) -eq $true) {
        return $logoFilePath
    } else {
        return $null
    }
}
filter ArrayToDict
{
    begin { $dict = @{} }
    process { $dict[$_.PackageFamilyName] = $_ }
    end { return $dict }
}
$packageFamilyNamesToPackages = Get-AppxPackage -PackageTypeFilter Main | ArrayToDict;
function Get-Icon($appId) {
    $appId = $_.AppID.SubString($_.AppId.IndexOf("!") + 1)
    $packageFamilyName = $_.AppID.SubString(0, $_.AppId.IndexOf("!"))
    $package = $packageFamilyNamesToPackages[$packageFamilyName]
    $packageFullName = $package.PackageFullName
    if ($packageFullName -ne $null) {
        $manifest = Get-AppxPackageManifest $packageFullName
        $app = $manifest.Package.Applications.Application | Where-Object { $_.Id -eq $appId }
        $logo = $app.VisualElements.Square44x44Logo
        if ($logo -eq $null) {
            $logo = $app.VisualElements.Square30x30Logo
        }
        if ($logo -eq $null) {
            $logo = $app.VisualElements.Logo
        }
        if ($logo -ne $null) {
            $logoFilePath = FindLogoFilePath(Join-Path $package.InstallLocation $logo)
            if ($logoFilePath -eq $null) {
                $logoFilePath = FindLogoFilePath([IO.Path]::Combine($package.InstallLocation, "images", $logo))
            }
            if ($logoFilePath -ne $null) {
                $logoBytes = Get-Content -Encoding Byte -Path $logoFilePath
                $logoBase64 = [Convert]::ToBase64String($logoBytes)
            } else {
                $logoBase64 = ""
            }
        } else {
            $logoBase64 = ""
        }
    }
    return 'data:image/png;base64,' + $logoBase64
}
$apps |
    % { @{ name = $_.Name; file = 'shell:AppsFolder\\' + $_.AppID; icon = Get-Icon($_.AppID) } } |
    ConvertTo-Json
    `;
    try {
        const result = await executeCommand(script, CommandMode.SIMPLE, 'powershell');
        const results = JSON.parse(result?.stdout || '[]');
        return await Promise.all(
            results.map(async (application: any) => ({
                file: application.file,
                application: application.file,
                icon: application.icon,
                name: { default: application.name },
                description: { },
                other: { },
            }))
        );
    } catch (e) {
        return [];
    }
}

const APP_EXTENTIONS = [ '.lnk', '.appref-ms', '.url', '.exe' ];

async function loadWin32Applications(directories: string[]): Promise<Application[]> {
    const folders = directories.map(dir => `'${dir}'`).join(', ');
    const extentions = APP_EXTENTIONS.map(dir => `*${dir}`).join(', ');
    const script = `
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'
$sh = New-Object -COM WScript.Shell
function Get-ShortcutTarget($filename) {
    $targetPath = $sh.CreateShortcut($filename).TargetPath 
    if ($targetPath) {
        return $targetPath
    } else {
        return $filename
    }
}
Add-Type -AssemblyName System.Drawing
function Get-Icon($filename) {
    $stream = New-Object IO.MemoryStream
    $bitmap = [System.Drawing.Icon]::ExtractAssociatedIcon($filename).toBitmap()
    $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
    $result = 'data:image/png;base64,' + [System.Convert]::ToBase64String($stream.ToArray())
    $stream.Dispose()
    $stream.Close()
    return $result
}
${folders} |
    % { Get-ChildItem -Path $_ -include ${extentions} -Recurse -File } |
    % { $targetFile = Get-ShortcutTarget($_.FullName);
        @{ file = $_.FullName; name = $_.BaseName; target = $targetFile; icon = Get-Icon($targetFile) } } |
    ConvertTo-Json
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($sh) | Out-Null
    `;
    try {
        const result = await executeCommand(script, CommandMode.SIMPLE, 'powershell');
        const results = unique(JSON.parse(result?.stdout || '[]'), (elem: any) => elem.target);
        return await Promise.all(
            results.map(async (application: any) => ({
                file: application.file,
                application: application.file,
                icon: application.icon,
                name: { default: application.name },
                description: { },
                other: { },
            }))
        );
    } catch (e) {
        return [];
    }
}

export async function updateApplicationCacheWindows(directories: string[]) {
    await loadApplicationCache();
    applications = [
        ...await loadWin32Applications(directories),
        ...await loadUWPApplications(directories),
    ];
    await updateCache();
}

export async function getAllApplicationsWinodws(): Promise<Application[]> {
    return applications;
}

export function executeApplicationWindows(application: any) {
    return openFile(application);
}

