# TortoiseSVN for VS Code

VS Code extension for [TortoiseSVN](https://tortoisesvn.net/) integration on Windows.

Rewritten fork of [TangYanxin/vscode-tortoise-svn](https://github.com/TangYanxin/vscode-tortoise-svn) (abandoned since 2017). Modernized build, added all missing TortoiseSVN commands, context menu submenu, multi-root workspace support, status bar integration, and bug fixes.

## Installation

Not published on the Marketplace. Install manually:

```
code --install-extension tortoise-svn-0.3.0.vsix
```

Or in VS Code: `Ctrl+Shift+P` > `Extensions: Install from VSIX...` > select the file.

### Build from source

```bash
git clone https://github.com/ludekvodicka/vscode-tortoise-svn.git
cd vscode-tortoise-svn
npm install
npm run compile
npx @vscode/vsce package --allow-missing-repository
code --install-extension tortoise-svn-*.vsix
```

## Requirements

**Windows only.** Requires [TortoiseSVN](https://tortoisesvn.net/) installed. The extension auto-detects `TortoiseProc.exe` from the registry. If detection fails, set `TortoiseSVN.tortoiseSVNProcExePath` in VS Code settings.

## Features

### Context Menu

Right-click in the explorer or editor shows a **TortoiseSVN** submenu:

- **Update**, **Commit**, **Check for Modifications**, **Log**, **Diff**
- **Revert**, **Add**, **Cleanup**, **Resolve**, **Blame**
- **SVN ... (Select Action)** — full action picker for the clicked item
- **Workspace SVN ... (Select Action)** — action picker for the workspace root
- **TortoiseSVN: Settings**

All actions operate on the right-clicked item.

### Keybindings

| Shortcut | Command |
|----------|---------|
| `Alt+S U` | SVN Update |
| `Alt+S C` | SVN Commit |
| `Alt+S L` | SVN Log |
| `Alt+S R` | SVN Revert |
| `Alt+S D` | SVN Diff |
| `Alt+S F` | SVN Check for Modifications |
| `Alt+S S` | SVN ... (Select Action) |
| `Alt+S M` | SVN ... (Select Path) |

### Status Bar

A clickable **SVN** item in the status bar opens "Check for Modifications".

### Multi-root Workspace

Commands automatically detect which workspace folder the target file belongs to.

### All Commands

**Workspace** (operate on workspace root): Update, Commit, Log, Revert, Cleanup, Add, Diff, Lock, Unlock, Merge, Check for Modifications, Repository Browser, Switch, Resolve, Create Patch, Revision Graph, Properties, Shelve, Unshelve

**File** (operate on active file): Update, Commit, Log, Revert, Cleanup, Add, Blame, Diff, Lock, Unlock, Check for Modifications, Resolve, Conflict Editor, Create Patch, Rename, Remove, Properties

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `TortoiseSVN.autoCloseUpdateDialog` | `false` | Auto-close dialog when no errors/conflicts |
| `TortoiseSVN.tortoiseSVNProcExePath` | `""` | Manual path to TortoiseProc.exe (auto-detected if empty) |
| `TortoiseSVN.showPath.exclude` | `["**/{node_modules,bower_components}/**"]` | Glob patterns to exclude from path picker |

## Change Log

### Version 0.3.0
* Add all missing TortoiseSVN commands: repository browser, switch, resolve, conflict editor, create patch, revision graph, rename, remove, properties, shelve, unshelve
* Add TortoiseSVN Settings command (opens TortoiseSVN's own settings dialog)
* Add "TortoiseSVN" submenu to explorer and editor right-click context menus with clean action names (Update, Commit, Check for Modifications, Log, Diff, Revert, Add, Cleanup, Resolve, Blame)
* Add "Workspace SVN ... (Select Action)" to context submenu for workspace-wide operations
* Context menu commands now operate on the right-clicked item, not always workspace root
* Add SVN status bar item (click to open Check for Modifications)
* Multi-root workspace support — commands detect which workspace folder the target file belongs to
* Replace deprecated `vscode.workspace.rootPath` with `vscode.workspace.workspaceFolders`
* Fix subscription memory leak in "Select Path" command handler
* Fix glob error crash (now properly rejects instead of throwing)
* Remove dead code, replace deprecated `String.substr()`
* Remove `*` activation event (VS Code 1.74+ infers from commands)
* Improve registry detection of TortoiseProc.exe

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
* apply command to the select file/directory on explorer by use context menu item `SVN ... (Select Action)`
* add new commands for the active file which open in text editor and has focus
* remove `blame` command when target is directory
* modify command name and command title, such as `tortoise-svn...` --> `SVN ... (Select Path)`
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

## License

[MIT](https://github.com/ludekvodicka/vscode-tortoise-svn/blob/master/LICENSE)
