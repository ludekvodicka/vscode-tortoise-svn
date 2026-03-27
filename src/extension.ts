'use strict';
import * as vscode from 'vscode';
import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import glob = require('glob');

const DIRECTORY_ACTIONS: string[] = [
    'update', 'commit', 'revert', 'cleanup', 'log', 'add', 'diff',
    'lock', 'unlock', 'merge', 'repostatus', 'repobrowser', 'switch',
    'resolve', 'createpatch', 'revisiongraph', 'properties', 'shelve', 'unshelve'
];

const FILE_ACTIONS: string[] = [
    'update', 'commit', 'revert', 'cleanup', 'log', 'add', 'blame', 'diff',
    'lock', 'unlock', 'repostatus', 'resolve', 'conflicteditor',
    'createpatch', 'rename', 'remove', 'properties'
];

interface SvnQuickPickItem extends vscode.QuickPickItem {
    action?: string;
    path: string;
}

function getWorkspaceRootPath(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

export function activate(context: vscode.ExtensionContext) {
    let tortoiseCommand = new TortoiseCommand();

    DIRECTORY_ACTIONS.forEach((action) => {
        let disposable = vscode.commands.registerCommand(`workspace tortoise-svn ${action}`, (uri?: vscode.Uri) => {
            tortoiseCommand.exec(action, uri?.fsPath || getWorkspaceRootPath());
        });
        context.subscriptions.push(disposable);
    });

    FILE_ACTIONS.forEach((action) => {
        let disposable = vscode.commands.registerCommand(`file tortoise-svn ${action}`, (uri?: vscode.Uri) => {
            let filePath = uri?.fsPath || vscode.window.activeTextEditor?.document.uri.fsPath;
            if (!filePath) {
                vscode.window.showWarningMessage('This command requires an open file in the text editor.');
                return;
            }
            tortoiseCommand.exec(action, filePath);
        });
        context.subscriptions.push(disposable);
    });

    let disposableNeedChoose = vscode.commands.registerCommand('tortoise-svn ...', (uri: vscode.Uri) => {
        let uriInfo = new UriInfo(uri?.fsPath);
        let actionQuickPickItems = uriInfo.getActionQuickPickItem();
        vscode.window.showQuickPick<SvnQuickPickItem>(actionQuickPickItems).then((quickPickItem) => {
            if (quickPickItem) {
                tortoiseCommand.exec(quickPickItem.action, quickPickItem.path);
            }
        });
    });
    context.subscriptions.push(disposableNeedChoose);

    let disposableDropdown = vscode.commands.registerCommand('tortoise-svn ...(select path)', () => {
        let rootPath = getWorkspaceRootPath();
        if (!rootPath) {
            vscode.window.showWarningMessage('No workspace folder open.');
            return;
        }
        getQuickPickItemsFromDir(rootPath).then(quickPickItems => {
            return vscode.window.showQuickPick<SvnQuickPickItem>(quickPickItems);
        }).then(selectedPath => {
            if (!selectedPath) {
                return;
            }
            let uriInfo = new UriInfo(selectedPath.path);
            let actionQuickPickItems = uriInfo.getActionQuickPickItem();
            vscode.window.showQuickPick<SvnQuickPickItem>(actionQuickPickItems).then((action) => {
                if (action) {
                    tortoiseCommand.exec(action.action, action.path);
                }
            });
        });
    });
    context.subscriptions.push(disposableDropdown);

    // Context menu commands — short titles, URI-aware
    const CONTEXT_ACTIONS: { action: string, id: string }[] = [
        { action: 'update', id: 'tortoise-svn.ctx.update' },
        { action: 'commit', id: 'tortoise-svn.ctx.commit' },
        { action: 'repostatus', id: 'tortoise-svn.ctx.repostatus' },
        { action: 'log', id: 'tortoise-svn.ctx.log' },
        { action: 'diff', id: 'tortoise-svn.ctx.diff' },
        { action: 'revert', id: 'tortoise-svn.ctx.revert' },
        { action: 'add', id: 'tortoise-svn.ctx.add' },
        { action: 'cleanup', id: 'tortoise-svn.ctx.cleanup' },
        { action: 'resolve', id: 'tortoise-svn.ctx.resolve' },
        { action: 'blame', id: 'tortoise-svn.ctx.blame' },
    ];
    CONTEXT_ACTIONS.forEach(({ action, id }) => {
        let disposable = vscode.commands.registerCommand(id, (uri?: vscode.Uri) => {
            tortoiseCommand.exec(action, uri?.fsPath || getWorkspaceRootPath());
        });
        context.subscriptions.push(disposable);
    });

    // Workspace-level action picker (always uses workspace root)
    let disposableWorkspaceCtx = vscode.commands.registerCommand('tortoise-svn.ctx.workspace', () => {
        let rootPath = getWorkspaceRootPath();
        if (!rootPath) {
            vscode.window.showWarningMessage('No workspace folder open.');
            return;
        }
        let uriInfo = new UriInfo(rootPath);
        let actionQuickPickItems = uriInfo.getActionQuickPickItem();
        vscode.window.showQuickPick<SvnQuickPickItem>(actionQuickPickItems).then((quickPickItem) => {
            if (quickPickItem) {
                tortoiseCommand.exec(quickPickItem.action, quickPickItem.path);
            }
        });
    });
    context.subscriptions.push(disposableWorkspaceCtx);

    // Status bar item — click to open Check for Modifications
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    statusBarItem.text = '$(source-control) SVN';
    statusBarItem.tooltip = 'SVN: Check for Modifications';
    statusBarItem.command = 'workspace tortoise-svn repostatus';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
}

function getQuickPickItemsFromDir(dirPath: string): Promise<SvnQuickPickItem[]> {
    return new Promise<SvnQuickPickItem[]>((resolve, reject) => {
        let quickPickItems: SvnQuickPickItem[] = [{
            label: dirPath,
            description: dirPath,
            path: dirPath
        }];
        let ignore: any = vscode.workspace.getConfiguration('TortoiseSVN').get('showPath.exclude');
        let options: any = { cwd: dirPath, mark: true };
        if (Array.isArray(ignore) && ignore.length > 0) {
            options.ignore = ignore;
        }
        glob('**', options, (err, paths) => {
            if (err) {
                reject(err);
                return;
            }
            let rootPath = getWorkspaceRootPath() || dirPath;
            paths.forEach(file => {
                let lastSep = file.lastIndexOf('/') + 1;
                if (lastSep === file.length) {
                    lastSep = 0;
                }
                quickPickItems.push({
                    label: file.substring(lastSep),
                    description: file.substring(0, lastSep),
                    path: path.join(rootPath, file)
                });
            });
            resolve(quickPickItems);
        });
    });
}

class UriInfo {
    path: string;
    isDirectory: boolean;
    isFile: boolean;

    constructor(uri?: string) {
        this.path = uri || getWorkspaceRootPath() || '';
        let stat: fs.Stats = fs.statSync(this.path);
        this.isFile = stat.isFile();
        this.isDirectory = stat.isDirectory();
    }

    public getActionQuickPickItem(): SvnQuickPickItem[] {
        let actions: string[];
        if (this.isFile) {
            actions = FILE_ACTIONS;
        } else {
            actions = DIRECTORY_ACTIONS;
        }
        return actions.map<SvnQuickPickItem>(action => ({
            label: 'svn ' + action,
            description: this.path,
            path: this.path,
            action: action
        }));
    }
}

class TortoiseCommand {
    private tortoiseSVNProcExePath: string;

    constructor() {
        this.tortoiseSVNProcExePath = this._getTortoiseSVNProcExePath();
    }

    public tortoiseSVNProcExePathIsExist(): boolean {
        try {
            let stat = fs.statSync(this.tortoiseSVNProcExePath);
            return stat.isFile();
        } catch (err) {
            return false;
        }
    }

    private _getTortoiseSVNProcExePath(): string {
        let tortoiseSVNProcExePath = vscode.workspace.getConfiguration('TortoiseSVN').get<string>('tortoiseSVNProcExePath') || '';
        if (!tortoiseSVNProcExePath) {
            try {
                let result = child_process.execSync(
                    'reg query HKEY_LOCAL_MACHINE\\SOFTWARE\\TortoiseSVN /v ProcPath'
                ).toString();
                let match = result.match(/REG_SZ\s+(.+\.exe)/i);
                if (match) {
                    tortoiseSVNProcExePath = match[1].trim();
                }
            } catch (error) {
                // TortoiseSVN not found in registry
            }
        }
        return tortoiseSVNProcExePath;
    }

    private _getTargetPath(fileUri: string): string {
        if (fileUri) {
            return fileUri;
        }
        if (vscode.window.activeTextEditor?.document) {
            return vscode.window.activeTextEditor.document.fileName;
        }
        return getWorkspaceRootPath() || '';
    }

    private _getCommand(action: string, fileUri: string): string {
        let closeonend = vscode.workspace.getConfiguration('TortoiseSVN').get('autoCloseUpdateDialog') ? 3 : 0;
        let targetPath = this._getTargetPath(fileUri);
        return `"${this.tortoiseSVNProcExePath}" /command:${action} /path:"${targetPath}" /closeonend:${closeonend}`;
    }

    exec(action: string, fileUri: string) {
        let fileSave: Thenable<boolean> | Promise<void>;
        if (action === 'revert') {
            fileSave = vscode.workspace.saveAll();
        } else {
            fileSave = Promise.resolve();
        }

        fileSave.then(() => {
            child_process.exec(this._getCommand(action, fileUri), (error) => {
                if (error && !this.tortoiseSVNProcExePathIsExist()) {
                    vscode.window.showErrorMessage(
                        'TortoiseProc.exe not found. Set "TortoiseSVN.tortoiseSVNProcExePath" in settings and restart VS Code.'
                    );
                }
            });
        });
    }
}
