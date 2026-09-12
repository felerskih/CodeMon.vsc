import * as assert from 'assert';
import * as vscode from 'vscode';

import { Egg } from '../models/mons/Egg';
import { EggFactory } from '../factories/EggFactory';
import { Fiend } from '../models/mons/Fiend/Fiend';
import { SabreCub } from '../models/mons/SaberCub/SabreCub';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Egg factory creates an egg whose next stage is Fiend or SabreCub', () => {
		const egg = EggFactory.create();

		assert.ok(egg instanceof Egg);
		assert.ok(egg.NextStage instanceof Fiend || egg.NextStage instanceof SabreCub);
	});
});
