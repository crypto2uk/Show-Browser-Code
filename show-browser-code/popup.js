// 加载保存的设置
async function loadSettings() {
  const result = await chrome.storage.sync.get(['profileId', 'textColor']);
  document.getElementById('profileId').value = result.profileId || "00";
  document.getElementById('colorInput').value = result.textColor || "#000000";
}

// 保存设置
async function saveSettings() {
  const id = document.getElementById('profileId').value;
  const color = document.getElementById('colorInput').value;

  // 验证数字格式
  if (!/^\d{1,3}$/.test(id)) {
    alert('请输入1-3位数字');
    return;
  }

  // 验证颜色格式
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    alert('请输入有效的颜色代码，例如 #FF0000');
    return;
  }

  await chrome.runtime.sendMessage({ 
    action: 'saveSettings', 
    id,
    color
  });
  window.close();
}

// 处理预设颜色点击
function handlePresetClick(e) {
  const preset = e.target.closest('.color-preset');
  if (preset) {
    const color = preset.dataset.color;
    document.getElementById('colorInput').value = color;
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('save').addEventListener('click', saveSettings);
document.querySelector('.color-presets').addEventListener('click', handlePresetClick); 