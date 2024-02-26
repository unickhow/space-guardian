import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Extension "Chinese English Spacing" is now active.');

	let disposable = vscode.commands.registerCommand('space-guardian.makeRoom', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const text = document.getText();
			const fileType = document.languageId;
			const newText = addSpacesBetweenChineseAndEnglish(text, fileType);
			if (newText !== text) {
				editor.edit(editBuilder => {
					const start = new vscode.Position(0, 0);
					const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
					editBuilder.replace(new vscode.Range(start, end), newText);
				});
			}
		}
	});

	context.subscriptions.push(disposable);
}

function addSpacesBetweenChineseAndEnglish(text: string, fileType: string): string {
	try {
		return text.replace(/([\u4E00-\u9FA5])([a-zA-Z])/g, '$1 $2')
				.replace(/([a-zA-Z])([\u4E00-\u9FA5])/g, '$1 $2');
	}	catch (e) {
		return text;
	}
}

export function deactivate() {}
