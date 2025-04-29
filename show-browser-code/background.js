// 从 storage 获取设置
async function getSettings() {
  const result = await chrome.storage.sync.get(['profileId', 'textColor']);
  return {
    profileId: result.profileId || "00",
    textColor: result.textColor || "#000000"
  };
}

// 保存设置
async function saveSettings(id, color) {
  await chrome.storage.sync.set({ 
    profileId: id,
    textColor: color
  });
  await updateIcon();
}

// 生成图标的 ImageData
function generateIconImageData(size, number, color) {
  const canvas = new OffscreenCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 根据数字位数调整字体大小
  const fontSize = number.length === 3 
    ? Math.floor(size * 0.6)
    : Math.floor(size * 0.9);

  // 设置文本样式
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 绘制数字 - 向下偏移2像素
  ctx.fillText(number, size/2, size/2 + 2);

  return ctx.getImageData(0, 0, size, size);
}

// 设置图标
async function setIcon(profileIdNumber, color) {
  const iconConfig = {
    imageData: {
      16: generateIconImageData(16, profileIdNumber, color),
      32: generateIconImageData(32, profileIdNumber, color),
      48: generateIconImageData(48, profileIdNumber, color),
      128: generateIconImageData(128, profileIdNumber, color)
    }
  };

  try {
    await chrome.action.setIcon(iconConfig);
  } catch (error) {
    console.error('Error setting icon:', error);
  }
}

// 更新图标的主要流程
async function updateIcon() {
  try {
    const settings = await getSettings();
    await setIcon(settings.profileId, settings.textColor);
  } catch (error) {
    console.error('Error in updateIcon:', error);
  }
}

// 监听插件安装/更新事件
chrome.runtime.onInstalled.addListener(updateIcon);

// 监听浏览器启动事件
chrome.runtime.onStartup.addListener(updateIcon);

// 处理来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveSettings') {
    saveSettings(message.id, message.color);
  }
}); 