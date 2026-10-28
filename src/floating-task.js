const bubble = document.querySelector('#bubble');
const stateText = document.querySelector('#stateText');
const interactionHint = document.querySelector('#interactionHint');
const taskTitle = document.querySelector('#taskTitle');
const taskTime = document.querySelector('#taskTime');
const countdownLabel = document.querySelector('#countdownLabel');
const countdown = document.querySelector('#countdown');
const taskDetails = document.querySelector('#taskDetails');
let lastRequestedSize = '';

function render(payload = {}) {
  const active = Boolean(payload.active);
  applyCategoryPalette(active ? payload.categoryColor : '#8b98a0');
  bubble.classList.toggle('is-idle', !active);
  bubble.classList.toggle('is-break', payload.state === 'break');
  bubble.classList.toggle('has-countdown', Boolean(payload.countdown));
  const isInteractionUnlocked = Boolean(payload.interactionUnlocked);
  bubble.classList.toggle('is-unlocked', isInteractionUnlocked);
  bubble.classList.toggle('is-hovering', Boolean(payload.pointerHovered));
  bubble.classList.toggle('is-docked', Boolean(payload.docked));
  ['left', 'right', 'top', 'bottom'].forEach((edge) => {
    bubble.classList.toggle(`dock-${edge}`, Boolean(payload.docked) && payload.dockEdge === edge);
  });
  stateText.textContent = payload.stateLabel || (active ? '当前进行中' : '当前暂无任务');
  taskTitle.textContent = payload.title || (active ? '未命名任务' : '暂无进行中的任务');
  taskTime.textContent = payload.timeRange || (active ? '--:-- - --:--' : '等待下一项安排');
  countdownLabel.textContent = payload.countdownLabel || '剩余时间';
  countdown.textContent = payload.countdown || '--:--';
  taskDetails.textContent = payload.details || (active ? '暂未填写事前计划或备注' : '最小化时会自动显示当前进行的任务。');
  interactionHint.textContent = isInteractionUnlocked ? '拖动中 · 松开恢复穿透' : 'Ctrl + Alt + 左键拖动';
  bubble.title = isInteractionUnlocked ? '正在移动：松开 Ctrl、Alt 和左键后恢复点击穿透' : '点击可穿透；按住 Ctrl 和 Alt 后，用左键拖动气泡';
  requestWindowResize();
}

function applyCategoryPalette(value) {
  const color = normalizeHexColor(value);
  const rgb = hexToRgb(color);
  bubble.style.setProperty('--bubble-accent', color);
  bubble.style.setProperty('--bubble-accent-rgb', rgb.join(', '));
  bubble.style.setProperty('--bubble-strong', rgbToHex(mixRgb(rgb, [20, 30, 25], 0.5)));
  bubble.style.setProperty('--bubble-muted', rgbToHex(mixRgb(rgb, [70, 82, 76], 0.45)));
  bubble.style.setProperty('--bubble-bg-start', rgbToHex(mixRgb(rgb, [255, 255, 255], 0.88)));
  bubble.style.setProperty('--bubble-bg-end', rgbToHex(mixRgb(rgb, [255, 255, 255], 0.76)));
}

function normalizeHexColor(value) {
  const color = String(value || '').trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : '#8b98a0';
}

function hexToRgb(color) {
  return [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16));
}

function mixRgb(source, target, targetWeight) {
  return source.map((channel, index) => Math.round(channel * (1 - targetWeight) + target[index] * targetWeight));
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function requestWindowResize() {
  window.requestAnimationFrame(() => {
    const bounds = bubble.getBoundingClientRect();
    const size = {
      width: Math.ceil(bounds.width),
      height: Math.ceil(bounds.height)
    };
    const signature = `${size.width}x${size.height}`;
    if (signature === lastRequestedSize) return;
    lastRequestedSize = signature;
    window.floatingTask.resize(size);
  });
}

window.floatingTask.onUpdate(render);
window.floatingTask.onFlash(({ times = 5 } = {}) => {
  bubble.classList.remove('is-flashing');
  bubble.style.animationIterationCount = String(Math.max(1, Number(times) || 5));
  void bubble.offsetWidth;
  bubble.classList.add('is-flashing');
});
