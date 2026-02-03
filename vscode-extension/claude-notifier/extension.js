// Claude Code Notifier Extension
// 接收通知請求並顯示 VSCode 原生通知，點擊可跳到 Claude Code 對話

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 通知檔案路徑
const NOTIFICATION_FILE = path.join(process.env.USERPROFILE || process.env.HOME, '.claude', 'pending-notification.json');

let fileWatcher = null;
let checkInterval = null;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Claude Notifier 已啟動');

  // 註冊命令
  let showNotificationCmd = vscode.commands.registerCommand('claude-notifier.showNotification', async () => {
    await checkAndShowNotification();
  });
  context.subscriptions.push(showNotificationCmd);

  // 註冊 URI handler: vscode://local.claude-notifier/notify?...
  let uriHandler = vscode.window.registerUriHandler({
    handleUri(uri) {
      if (uri.path === '/notify') {
        const params = new URLSearchParams(uri.query);
        const title = params.get('title') || 'Claude Code';
        const message = params.get('message') || '任務已完成';
        const project = params.get('project') || '';

        showClaudeNotification(title, message, project, '', '');
      }
    }
  });
  context.subscriptions.push(uriHandler);

  // 定期檢查通知檔案
  checkInterval = setInterval(async () => {
    await checkAndShowNotification();
  }, 2000); // 每 2 秒檢查一次

  // 清理
  context.subscriptions.push({
    dispose: () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    }
  });

  // 啟動時檢查一次
  checkAndShowNotification();
}

async function checkAndShowNotification() {
  try {
    if (fs.existsSync(NOTIFICATION_FILE)) {
      const content = fs.readFileSync(NOTIFICATION_FILE, 'utf8');
      const data = JSON.parse(content);

      // 刪除檔案（避免重複顯示）
      fs.unlinkSync(NOTIFICATION_FILE);

      // 顯示通知
      await showClaudeNotification(
        data.title || 'Claude Code',
        data.message || '任務已完成',
        data.project || '',
        data.sessionId || '',
        data.transcriptPath || ''
      );
    }
  } catch (error) {
    // 忽略錯誤（檔案不存在等）
  }
}

async function showClaudeNotification(title, message, projectPath, sessionId, transcriptPath) {
  // 建立通知訊息
  const fullMessage = `${title}\n${message}`;

  // 顯示帶按鈕的通知
  const selection = await vscode.window.showInformationMessage(
    fullMessage,
    { modal: false },
    'View',           // 聚焦到 Claude Code
    'Open Chat',      // 開啟對話 (用 claude --resume)
    'Dismiss'
  );

  if (selection === 'View') {
    // 聚焦到 Claude Code
    await focusClaudeCode();
  } else if (selection === 'Open Chat') {
    // 開啟對話
    await openClaudeChat(sessionId, projectPath);
  }
}

async function focusClaudeCode() {
  try {
    // 方法 1: 嘗試執行 Claude Code 的聚焦命令
    await vscode.commands.executeCommand('claude-code.focus');
  } catch (e1) {
    try {
      // 方法 2: 嘗試開啟 Claude Code 面板
      await vscode.commands.executeCommand('workbench.view.extension.claude-dev-ActivityBar');
    } catch (e2) {
      try {
        // 方法 3: 嘗試切換到第一個編輯器群組
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
        // 然後切換到第一個 Tab
        await vscode.commands.executeCommand('workbench.action.openEditorAtIndex1');
      } catch (e3) {
        // 方法 4: 顯示所有編輯器讓使用者選擇
        await vscode.commands.executeCommand('workbench.action.showAllEditors');
      }
    }
  }
}

async function openClaudeChat(sessionId, projectPath) {
  if (!sessionId) {
    vscode.window.showWarningMessage('無法開啟對話：缺少 Session ID');
    return;
  }

  // 建立新終端機執行 claude --resume
  const terminal = vscode.window.createTerminal({
    name: `Claude: ${sessionId.substring(0, 8)}`,
    cwd: projectPath || undefined
  });

  terminal.show();
  terminal.sendText(`claude --resume ${sessionId}`);
}

function deactivate() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
}

module.exports = {
  activate,
  deactivate
};
