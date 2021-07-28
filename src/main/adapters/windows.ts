
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { CommandMode, executeCommand } from 'main/adapters/commands';

export interface Window {
    title: string;
    application: string;
    icon?: string;
    window: unknown;
}

let windows: Window[] = [];

export async function updateWindowCache() {
    return runMatch(getPlatform(), {
        'linux': () => updateWindowCacheLinux(),
        'win32': () => updateWindowCacheWindows(),
        'unsupported': async () => []
    });
}

async function updateWindowCacheLinux() {
    const result = await executeCommand('wmctrl -x -l');
    windows = result?.stdout?.split('\n').filter(line => line)
        .map(line => line.split(' ').map((elm) => elm.trim()).filter((elm) => elm.length >= 1))
        .map(line => ({
            title: line.slice(4).join(' '),
            application: line[2],
            window: line[0],
        })) ?? [];
}

async function updateWindowCacheWindows() {
    const script = 'Get-Process | Where { $_.mainWindowTitle } | Select-Object -Property ProcessName, MainWindowTitle, MainWindowHandle | ConvertTo-Csv';
    const result = await executeCommand(script, CommandMode.SIMPLE, 'powershell');
    windows = result?.stdout?.split('\n').slice(2).filter(line => line)
        .map(line =>
            line.split(',')
                .map(elm => elm.trim())
                .map(elm => elm.substr(1, elm.length - 2).trim())
                .filter(elm => elm.length >= 1)
        )
        .map(line => ({
            title: line[1],
            application: line[0],
            window: line[2],
        })) ?? [];
}

export async function openWindows(): Promise<Window[]> {
    return windows;
}

export function focusWindow(window: unknown) {
    return runMatch(getPlatform(), {
        'linux': () => focusWindowLinux(window as string),
        'win32': () => focusWindowWindows(window as string),
        'unsupported': () => { }
    });
}

function focusWindowLinux(window: string) {
    return executeCommand(`wmctrl -i -a ${window}`);
}

function focusWindowWindows(window: string) {
    const script = `
$type = Add-Type -PassThru -NameSpace Util -Name SetFgWin -MemberDefinition @'
[DllImport("user32.dll", SetLastError=true)]
public static extern bool SetForegroundWindow(IntPtr hWnd);
[DllImport("user32.dll", SetLastError=true)]
public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);    
[DllImport("user32.dll", SetLastError=true)]
public static extern bool IsIconic(IntPtr hWnd);
'@
$null = $type::SetForegroundWindow(${window})
if ($type::IsIconic(${window})) {
    $type::ShowWindow(${window}, 9)
}
    `;
    return executeCommand(script, CommandMode.SIMPLE, 'powershell');
}

