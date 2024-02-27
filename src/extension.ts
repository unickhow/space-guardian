import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('space-guardian.makeRoom', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			let text = '';
			let range: vscode.Range | undefined = undefined;

			if (!selection.isEmpty) {
				// If there's a selection, get the text within the selection
				text = document.getText(selection);
				range = selection;
			} else {
				// If there's no selection, get the entire text
				text = document.getText();
				range = new vscode.Range(
					new vscode.Position(0, 0),
					new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
				);
			}

			const fileType = document.languageId;
			const newText = addSpacesBetweenChineseAndEnglish(text, fileType);

			if (newText !== text) {
				editor.edit(editBuilder => {
					editBuilder.replace(range!, newText);
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
