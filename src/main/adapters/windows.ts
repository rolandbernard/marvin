
import { basename } from 'path';

import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { CommandMode, executeCommand } from 'main/adapters/commands';

export interface Window {
    title: string;
    application: string;
    icon?: string;
    window: string;
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
            title: line.slice(4).join(' ').normalize('NFKD'),
            application: line[2].normalize('NFKD'),
            window: line[0],
        })) ?? [];
}

async function updateWindowCacheWindows() {
    const script = `
[Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8
$ErrorActionPreference = 'SilentlyContinue'
Add-Type @"
using System;
using System.Collections.Generic;
using System.Text;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.ComponentModel;

public class InfoWindow {
    public IntPtr Handle = IntPtr.Zero;
    public string File = "";
    public string Title = "";
}

public class RunningWindows {

    [DllImport("USER32.DLL")]
    private static extern bool EnumWindows(EnumWindowsProc enumFunc, int lParam);

    [DllImport("USER32.DLL")]
    private static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("USER32.DLL")]
    private static extern int GetWindowTextLength(IntPtr hWnd);

    [DllImport("USER32.DLL")]
    private static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("USER32.DLL")]
    private static extern IntPtr GetShellWindow();

    [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern int GetWindowThreadProcessId(IntPtr handle, out uint processId);  

    public static string GetProcessPath(IntPtr hwnd) {
        if (hwnd != IntPtr.Zero) {
            uint pid = 0;
            GetWindowThreadProcessId(hwnd, out pid);
            if (pid != 0) {
                var process = Process.GetProcessById((int)pid);
                if (process != null) {
                    return process.MainModule.FileName.ToString();
                }
            }
        }
        return "";
    }

    private delegate bool EnumWindowsProc(IntPtr hWnd, int lParam);

    public static List<InfoWindow> GetOpenedWindows()
    {
        IntPtr shellWindow = GetShellWindow();
        List<InfoWindow> windows = new List<InfoWindow>();

        EnumWindows(new EnumWindowsProc(delegate(IntPtr hWnd, int lParam) {
            if (hWnd == shellWindow) {
                return true;
            }
            if (!IsWindowVisible(hWnd)) {
                return true;
            }
            int length = GetWindowTextLength(hWnd);
            if (length == 0) {
                return true;
            }
            StringBuilder builder = new StringBuilder(length);
            GetWindowText(hWnd, builder, length + 1);
            var info = new InfoWindow();
            info.Handle = hWnd;
            info.File = GetProcessPath(hWnd);
            info.Title = builder.ToString();
            windows.Add(info);
            return true;
        }), 0);

        return windows;
    }
}
"@
[RunningWindows]::GetOpenedWindows() | ConvertTo-Json
    `;
    try {
        const result = await executeCommand(script, CommandMode.SIMPLE, 'powershell');
        windows = JSON.parse(result?.stdout ?? '[]')
            .map((window: any) => ({
                title: window.Title.normalize('NFKD'),
                application: basename(window.File).normalize('NFKD'),
                window: window.Handle,
            }));
    } catch (e) {
        /* Ignore errors that might happen when parsing */
    }
}

export async function openWindows(): Promise<Window[]> {
    return windows;
}

export function focusWindow(window: string) {
    return runMatch(getPlatform(), {
        'linux': () => focusWindowLinux(window),
        'win32': () => focusWindowWindows(window),
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

