import * as vscode from 'vscode';
import * as fs from 'fs';

import { SidebarState } from './models/messages/SidebarState'
import { Codemon } from './models/mons/Codemon';
import { Egg } from './models/mons/Egg';
import { GLOBALS } from './models/Globals';

export class CodeMonSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'codemon.sidebar';

  private _view?: vscode.WebviewView;
  private currentMon: Codemon | undefined = new Egg();
  private currentState: SidebarState =
  {
    XpProgress: `0/${this.currentMon?.EvolvesAt}`,
    Stage: this.currentMon!.Name,
    DisplayTime: this.formatTime(GLOBALS().WorkTime),
    ImageUri: ''
  };

  private xpPerWorkingSession = 5;

  private onSessionCompleteAck?: () => void;
  private onToggleTimerRequested?: () => void;


  constructor(private readonly context: vscode.ExtensionContext) {
    this._view?.webview.postMessage(this.currentState);
  }

  setOnSessionCompleteAck(callback: () => void) {
    this.onSessionCompleteAck = callback;
  }

  setOnToggleTimerRequested(callback: () => void) {
    this.onToggleTimerRequested = callback;
  }

  showSessionComplete(message: string, buttonText: string) {
    this._view?.webview.postMessage({ type: 'notification', message: message, buttonText: buttonText });
  }

  updateRunningState(isRunning: boolean) {
    this._view?.webview.postMessage({ type: 'runningState', isRunning });
  }

  resolveWebviewView(view: vscode.WebviewView) {
    this._view = view;

    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'media')
      ]
    };
    view.webview.html = this.getHtml(view.webview);
    
    this.currentState.ImageUri = this.getImageUri(view, this.currentMon!.ImageFileName).toString();
    view.webview.postMessage(this.currentState);

    view.webview.onDidReceiveMessage(message => {
      if (message.command === 'ready') {
        view.webview.postMessage(this.currentState); // send state now that it's actually listening
      }
      else if (message.command === 'sessionComplete') {
        this.onSessionCompleteAck?.();
      }else if (message.command === 'toggleTimer') {
        this.onToggleTimerRequested?.();
      }
    });
  }

  updateTimer(secondsRemaining: number) {
    const displayTime = this.formatTime(secondsRemaining);
    this.currentState.DisplayTime = displayTime;
    this._view?.webview.postMessage(this.currentState);
  }

  resetTimer(time: number, isWorking: boolean, linesWritten: number = 0) {
    if (isWorking)
      this.update(linesWritten)
    this.currentState.DisplayTime = this.formatTime(time);
    this._view?.webview.postMessage(this.currentState);
  }

  private update(linesWritten: number): boolean {
    var evolved = false;    
    var linesXp = linesWritten / 20;

    this.currentMon!.CurrentXp += this.xpPerWorkingSession + linesXp;
    if(this.currentMon!.CurrentXp >= this.currentMon!.EvolvesAt && this.currentMon?.NextStage !== undefined)
    {
      this.currentMon = this.currentMon?.NextStage;
      evolved = true;
      if (this._view)
        this.currentState.ImageUri = this.getImageUri(this._view, this.currentMon!.ImageFileName).toString();
    }
    var toUpdate = `${this.currentMon!.CurrentXp}/${this.currentMon!.EvolvesAt}`;

    this.currentState.XpProgress = toUpdate;
    this.currentState.Stage =  this.currentMon!.Name
    return evolved;
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private getImageUri(view: vscode.WebviewView, fileName: string): vscode.Uri {
  return view.webview.asWebviewUri(
    vscode.Uri.joinPath(this.context.extensionUri, 'media', 'images', fileName)
  );
}

  private getHtml(webview: vscode.Webview): string {
    const htmlPath = vscode.Uri.joinPath(this.context.extensionUri, 'media', 'sidebar.html');
    let html = fs.readFileSync(htmlPath.fsPath, 'utf8');

    html = html.replace(/\${cspSource}/g, webview.cspSource);

    return html;
  }
}