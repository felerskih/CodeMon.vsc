// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CodeMonSidebarProvider } from './CodeMonSidebarProvider';

import { PomodoroTimer } from './PomodoroTimer';
import { initGlobals } from './models/Globals';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "codemon" is now active!');
	var linesWritten = 0;
	const linesSnapshot = new Map<string, number>();

	initGlobals(context);

	const provider = new CodeMonSidebarProvider(context);
  	context.subscriptions.push(vscode.window.registerWebviewViewProvider(
		CodeMonSidebarProvider.viewType,
		provider)
	);
	
	const timer = new PomodoroTimer(
		(remaining) => provider.updateTimer(remaining),
		() => 
			{
				const msg = timer.getIsWorking() ? "25-minute focus session complete! Great work!" : "Break Time Over!";
				const btnTxt = timer.getIsWorking() ? "+5 Exp" : "Back to work";
				provider.showSessionComplete(msg, btnTxt);
			}
	);
	
	provider.setOnSessionCompleteAck(() => {
		timer.reset();
		provider.resetTimer(timer.getTimeRemaining(), !timer.getIsWorking(), linesWritten);
		linesWritten = 0;
	});

	provider.setOnToggleTimerRequested(() => {
		if (timer.getIsRunning()) {
			timer.stop();
		} else {
			timer.start();
		}
		provider.updateRunningState(timer.getIsRunning());
	});

	provider.updateRunningState(timer.getIsRunning());

	timer.start();

	vscode.workspace.textDocuments.forEach(doc =>
      	linesSnapshot.set(doc.uri.toString(), countLines(doc.getText()))
    );

    vscode.workspace.onDidOpenTextDocument(doc => {
      	linesSnapshot.set(doc.uri.toString(), countLines(doc.getText()));
    });

    vscode.workspace.onDidCloseTextDocument(doc => {
      	linesSnapshot.delete(doc.uri.toString());
    });

	vscode.workspace.onDidChangeTextDocument(event => {
		const uri = event.document.uri.toString();
		const prev = linesSnapshot.get(uri) ?? 0;
		const current = countLines(event.document.getText());
		const delta = current - prev;
		
		if (delta > 0) {
			linesWritten += delta;
		}

		linesSnapshot.set(uri, current);
	});

	context.subscriptions.push(
		vscode.commands.registerCommand('codemon.startTimer', () => timer.start()),
		vscode.commands.registerCommand('codemon.stopTimer', () => timer.stop()),
		vscode.commands.registerCommand('codemon.resetTimer', () => timer.reset())
);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function countLines(text: string): number {
	if (text.length === 0) return 0;
	return text.split(/\r\n|\r|\n/)
		.filter(l => l.trim().length > 0)
		.length;
}