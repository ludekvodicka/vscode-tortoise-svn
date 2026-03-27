# TortoiseSVN for VS Code

A simple VS Code extension for TortoiseSVN integration. Fork of [TangYanxin/vscode-tortoise-svn](https://github.com/TangYanxin/vscode-tortoise-svn) with added commands and modernized build.

## Installation (local .vsix)

This extension is not published on the Marketplace. Install it manually:

1. Download the latest `.vsix` from [GitHub Releases](https://github.com/ludekvodicka/vscode-tortoise-svn/releases) or build it yourself (see below)
2. Install via command line:
   ```
   code --install-extension tortoise-svn-0.3.0.vsix
   ```
   Or in VS Code: `Ctrl+Shift+P` > `Extensions: Install from VSIX...` > select the file
3. Restart VS Code

### Build from source

```bash
git clone https://github.com/ludekvodicka/vscode-tortoise-svn.git
cd vscode-tortoise-svn
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
code --install-extension tortoise-svn-*.vsix
```

## Features

tortoise-svn provides commands to open TortoiseSVN window for update, commit, log, revert, cleanup, add, diff, blame, lock, unlock, and check for modifications.
tortoise-svn provides `dropdown` to select TortoiseSVN action.   
Alternatively, you can select target file/directory first, then select the action.   

## Requirements
**It runs only on Windows and needs the TortoiseSVN and TortoiseSVN command line tools.**   

If TortoiseSVN is not installed at `C:\\Program Files\\TortoiseSVN\\bin\\TortoiseProc.exe`,
please specify the correct path by setting property `TortoiseSVN.tortoiseSVNProcExePath` in user `settings.json`. 


### Commands

#### Workspace commands (operate on workspace root)
* `Workspace: SVN Update` — update working copy
* `Workspace: SVN Commit` — commit changes
* `Workspace: SVN Log` — view commit history
* `Workspace: SVN Revert` — discard local changes
* `Workspace: SVN Cleanup` — clean working copy
* `Workspace: SVN Add` — mark for addition
* `Workspace: SVN Diff` — view changes
* `Workspace: SVN Lock` / `Unlock` — lock/unlock files
* `Workspace: SVN Merge` — merge branches
* `Workspace: SVN Check for Modifications` — show modified files
* `Workspace: SVN Repository Browser` — browse the repository
* `Workspace: SVN Switch` — switch to a different branch/tag
* `Workspace: SVN Resolve` — mark conflicts resolved
* `Workspace: SVN Create Patch` — create a patch file
* `Workspace: SVN Revision Graph` — visual branch history
* `Workspace: SVN Properties` — view/edit SVN properties
* `Workspace: SVN Shelve` / `Unshelve` — shelve/unshelve changes

#### File commands (operate on the active file in the editor)
* `File: SVN Update` — update file
* `File: SVN Commit` — commit file
* `File: SVN Log` — file history
* `File: SVN Revert` — discard file changes
* `File: SVN Cleanup` — clean file
* `File: SVN Add` — mark file for addition
* `File: SVN Blame` — line-by-line author history
* `File: SVN Diff` — view file changes
* `File: SVN Lock` / `Unlock` — lock/unlock file
* `File: SVN Check for Modifications` — show modified files
* `File: SVN Resolve` — mark conflict resolved
* `File: SVN Conflict Editor` — open conflict editor
* `File: SVN Create Patch` — create patch for file
* `File: SVN Rename` — SVN-aware rename
* `File: SVN Remove` — SVN-aware delete
* `File: SVN Properties` — view/edit SVN properties

#### Other commands
* `SVN ... (Select Action)` — show a dropdown to select TortoiseSVN action to execute on the current file/workspace
* `SVN ... (Select Path)` — show a dropdown to select target file/directory, then select the action
* `TortoiseSVN: Settings` — open TortoiseSVN's own settings dialog

### Context Menu (right-click)

Right-clicking in the explorer or editor shows a **TortoiseSVN** submenu with clean action names. All actions operate on the right-clicked item (not the workspace root):

* Update, Commit, Check for Modifications, Log, Diff
* Revert, Add, Cleanup, Resolve, Blame
* SVN ... (Select Action) — full action picker for the clicked item
* Workspace SVN ... (Select Action) — full action picker, always for the workspace root
* TortoiseSVN: Settings

### Multi-root Workspace Support

In multi-root workspaces, commands automatically detect which workspace folder the target file belongs to. The workspace-level commands operate on the correct root folder.

### Keybindings

* `alt+s u` : "Workspace: SVN Update"
* `alt+s c` : "Workspace: SVN Commit"
* `alt+s l` : "Workspace: SVN Log"
* `alt+s r` : "Workspace: SVN Revert"
* `alt+s d` : "Workspace: SVN Diff"
* `alt+s f` : "Workspace: SVN Check for Modifications"
* `alt+s m` : "SVN ... (Select Path)"

## Extension Settings

This extension contributes the following settings:

* `TortoiseSVN.autoCloseUpdateDialog` : enable/disable auto close dialog when no errors, conflicts and merges.
* `TortoiseSVN.tortoiseSVNProcExePath` : specify the correct `TortoiseProc.exe` path. Need restart VSCode.
* `TortoiseSVN.showPath.exclude` : specify `glob pattern` to exclude files and folders. exclude will disable when specify a empty array.

### Status Bar
A clickable **SVN** item appears in the status bar. Clicking it opens "Check for Modifications".

## Change Log
### Version 0.3.0
* Add all missing TortoiseSVN commands: repository browser, switch, resolve, conflict editor, create patch, revision graph, rename, remove, properties, shelve, unshelve
* Add TortoiseSVN Settings command
* Add "TortoiseSVN" submenu to right-click context menus with clean action names
* Context menu commands operate on the right-clicked item
* Add SVN status bar item (click to open Check for Modifications)
* Multi-root workspace support
* Replace deprecated `vscode.workspace.rootPath`, fix subscription leak, fix glob error crash
* Remove `*` activation event (VS Code 1.74+ infers from commands)

### Version 0.2.0
* Add "Check for Modifications" command (`repostatus`) for both workspace and file scope
* Add `alt+s f` keybinding for workspace "Check for Modifications"
* Modernize build: replace deprecated `vscode` dev package with `@types/vscode`, upgrade TypeScript to v5
* Update minimum VS Code engine to 1.60.0

### Version 0.1.1
* when user don't set `TortoiseSVN.tortoiseSVNProcExePath`, get the `TortoiseProc.exe` path from registry 
* postpone check `TortoiseProc.exe` path until command execution

### Version 0.0.7
* fix can't revert unsaved changes
* remove unused package minimatch
* optimize activationEvents in package.json

### Version 0.0.6
* check `TortoiseProc.exe` path. If it is invaild will show a hint

### Version 0.0.5
* `select path`: support setting `glob pattern` to exclude files
* `select path`: improve performance

### Version 0.0.4
* apply command to the select file/directory on explorer by use context menu item `SVN ... (Select Action) `
* add new commands for the active file which open in text editor and has focus
* remove `blame` command when target is directory
* modify command name and command title, such as `tortoise-svn...` -->  `SVN ... (Select Path)`
* remove menu `tortoise-svn log in workspace` from `explorer/context` and `editor/context` 
* improve keybindings configuration
* some bug fixed

### Version 0.0.3
* add command `tortoise-svn...` which can select TortoiseSVN action and target dir or file
* add menu `tortoise-svn...` to `explorer/context` and `editor/context` 
* add `keybindings` `alt+s m`: tortoise-svn...

### Version 0.0.2
* add more menu

### Version 0.0.1
* Initial release

## Links

[Change log](https://github.com/ludekvodicka/vscode-tortoise-svn/blob/master/CHANGELOG.md)

[Source on GitHub](https://github.com/ludekvodicka/vscode-tortoise-svn)

[Original repository](https://github.com/TangYanxin/vscode-tortoise-svn)

[MIT](https://github.com/ludekvodicka/vscode-tortoise-svn/blob/master/LICENSE)

**Enjoy!**