import * as vscode from 'vscode';
import { environment as localEnv } from './environment/environment.local';
import { environment as betaEnv } from './environment/environment.beta';

export interface GlobalsConfig {
  WorkTime: number;
  BreakTime: number;
}

let _globals: GlobalsConfig | undefined;

export function initGlobals(context: vscode.ExtensionContext): GlobalsConfig {
  const isDev = context.extensionMode === vscode.ExtensionMode.Development;
  _globals = isDev ? localEnv : betaEnv;

  console.log(`[CodeMon] Loaded '${isDev ? 'local' : 'beta'}' globals:`, _globals);
  return _globals;
}

export function GLOBALS(): GlobalsConfig {
  if (!_globals) {
    throw new Error('GLOBALS accessed before initGlobals() was called in activate()');
  }
  return _globals;
}