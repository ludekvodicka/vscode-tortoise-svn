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

See [CHANGELOG.md](https://github.com/ludekvodicka/vscode-tortoise-svn/blob/master/CHANGELOG.md) for full history.

## License

[MIT](https://github.com/ludekvodicka/vscode-tortoise-svn/blob/master/LICENSE)
