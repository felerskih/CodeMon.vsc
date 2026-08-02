# codemon README

CodeMon is a Productivity Extension for VS Code. Evolve your CodeMon by investing time and effort into coding!

## Features
### How to Evolve
Pomodoro Timer - Built in tracking for 25 minutes of working, 5 minutes of break. Gain XP for each working session!
LoC tracker - Each 20 lines of code contributes 1 additional XP! (Subject to change, this is probably very minimal with AI tools)

### Miscellaneous
Pictures drawn in MSPaint by me!!!

## Requirements
Node & Npm
Python (for vsce)

## Run Steps (from VSCode)
1. Run `npm install`
2. Press F5

## Build steps
1. Run `npm install`
2. Run `npm install -g @vscode/vsce`
3. Run `vsce package`
4. Run `code --install-extension codemon-0.0.4.vsix --force`

## Known Issues
None yet!

## Release Notes
### 0.0.1
Beta Release!

### 0.0.2
- Improved CSS to look more like a Dex
- New buttons to end session/break early

### 0.0.3
- Improved UI for end session/end break button
- Continue to Next Session/Continue Break
- Diminishing returns for ending session early and skipping breaks

### 0.0.4
- Swapped position of Continue and reset buttons

## Potential Future Features
- Adventure Text
- Animations
- More Mon

## Following extension guidelines
Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Contribute
Make a PR!