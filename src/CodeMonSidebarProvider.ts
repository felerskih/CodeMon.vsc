import * as vscode from 'vscode';
import * as fs from 'fs';

import { SidebarState } from './models/messages/SidebarState'
import { Codemon } from './models/mons/Codemon';
import { EggFactory } from './factories/EggFactory';
import { GLOBALS } from './models/Globals';

export class CodeMonSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'codemon.sidebar';

  private _view?: vscode.WebviewView;
  private currentMon: Codemon | undefined = EggFactory.create();
  private currentState: SidebarState =
  {
    XpProgress: `0/${this.currentMon?.EvolvesAt}`,
    Stage: this.currentMon!.Name,
    DisplayTime: this.formatTime(GLOBALS().WorkTime),
    ImageUri: ''
  };

  private xpPerWorkingSession = 5;
  private breaksSkipped = 0;

  private onSessionCompleteAck?: () => void;
  private onContinueAck?: () => void;
  private onToggleTimerRequested?: () => void;
  private onEarlyBreak?:() => void;


  constructor(private readonly context: vscode.ExtensionContext) {
    this._view?.webview.postMessage(this.currentState);
  }

  setOnSessionCompleteAck(callback: () => void) {
    this.onSessionCompleteAck = callback;
  }

  setOnContinueAck(callback: () => void) {
    this.onContinueAck = callback;
  }

  setOnToggleTimerRequested(callback: () => void) {
    this.onToggleTimerRequested = callback;
  }

  setOnEarlyBreak(callback: () => void)
  {
    this.onEarlyBreak = callback;
  }

  showSessionComplete(isWorking: boolean) {
    var message = "";
    var buttonText = "";
    if(isWorking)
    {
      message = this.currentMon!.getBreakText();
      buttonText = "+5 XP";
    }
    else
    {
      message = this.currentMon!.getStartText();
      buttonText = "Back to work";
    }
    this._view?.webview.postMessage({ type: 'notificationComplete', message, buttonText, isWorking });
  }

  updateRunningState(isRunning: boolean) {
    this._view?.webview.postMessage({ type: 'runningState', isRunning });
  }

  showEarlyBreak(isWorking: boolean)
  {
    var message = "";
    var buttonText = "";
    if(isWorking)
    {
      message = "Taking an early break 😴";
      buttonText = "Work!";
    }
    else
    {
      message = "Went back to exploring early!";
      buttonText = "Break!";
    }
    this._view?.webview.postMessage({ type: 'notificationEarly', message, buttonText, isWorking});
  }

  updateBreakText(breakText: string) {
    this._view?.webview.postMessage({ type: 'breakTextChange', breakText });
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
      } else if (message.command === 'continue') {
        this.onContinueAck?.();
      }
      else if (message.command === 'toggleTimer') {
        this.onToggleTimerRequested?.();
      }
      else if (message.command === 'earlyBreak') {
        this.onEarlyBreak?.();
      }
    });
  }

  updateTimer(secondsRemaining: number) {
    const displayTime = this.formatTime(secondsRemaining);
    this.currentState.DisplayTime = displayTime;
    this._view?.webview.postMessage(this.currentState);
  }

  resetTimer(time: number, isWorking: boolean, linesWritten: number = 0, timeBeforeBreak: number = 0, isContinue: boolean = false) {
    var sessionXp = this.calculateSessionXp(timeBeforeBreak, isContinue);
    var linesXp = this.calculateLinesXp(linesWritten);
    if (isWorking)
      this.update(linesXp, sessionXp);
    this.currentState.DisplayTime = this.formatTime(time);
    this._view?.webview.postMessage(this.currentState);
  }

  private calculateSessionXp(timeBeforeBreak: number, isContinue: boolean)
  {
    var sessionXp = this.xpPerWorkingSession;
    if (timeBeforeBreak != 0) {
      var percentageLeft = timeBeforeBreak / GLOBALS().WorkTime;
      var percentageComplete = Math.round((1 - percentageLeft) * 10) / 10;
      sessionXp = sessionXp * percentageComplete;
    }
    if(isContinue)
    {
      var continueXp = sessionXp - this.breaksSkipped++;
      sessionXp = continueXp > 0 ? continueXp : 0;
    }
    else
      this.breaksSkipped = 0;
    return sessionXp;
  }

  private calculateLinesXp(linesWritten: number)
  {
    return linesWritten / 20;
  }

  private update(linesXp: number, timeXp: number): boolean {
    var evolved = false;  

    this.currentMon!.CurrentXp += timeXp + linesXp;
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