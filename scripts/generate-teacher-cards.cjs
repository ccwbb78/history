const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'teachers');
const WIDTH = 512;
const HEIGHT = 800;

const teachers = [
  { name: '占老师', subject: '数学老师', motto: '逻辑为基，思维作翼', color: '#3b82f6', accent: '#60a5fa' },
  { name: '张老师', subject: '语文老师', motto: '文以载道，字以传情', color: '#ef4444', accent: '#f87171' },
  { name: '李老师', subject: '英语老师', motto: '语言为桥，连通世界', color: '#8b5cf6', accent: '#a78bfa' },
  { name: '张r', subject: '物理老师', motto: '格物致知，穷理尽性', color: '#06b6d4', accent: '#22d3ee' },
  { name: '舒老师', subject: '化学老师', motto: '变化无穷，匠心守恒', color: '#22c55e', accent: '#4ade80' },
  { name: '吴老师', subject: '生物老师', motto: '生生不息，探索自然', color: '#10b981', accent: '#34d399' },
];

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}

function gradient(ctx, color, y1 = 0, y2 = HEIGHT) {
  const [r, g, b] = hexToRgb(color);
  const grad = ctx.createLinearGradient(0, y1, 0, y2);
  grad.addColorStop(0, `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`);
  grad.addColorStop(1, `rgb(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)})`);
  return grad;
}

function drawCard(teacher, index) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  const { name, subject, motto, color, accent } = teacher;

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Header band
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, WIDTH, 220);

  // Decorative circles
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(WIDTH - 60, 80, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-40, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Card inner shadow / frame
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#ffffff';
  drawRoundedRect(ctx, 32, 120, WIDTH - 64, HEIGHT - 160, 24);
  ctx.fill();
  ctx.restore();

  // Avatar circle
  const cx = WIDTH / 2;
  const cy = 230;
  const avatarR = 90;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, avatarR, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = gradient(ctx, color, cy - avatarR, cy + avatarR);
  ctx.fillRect(cx - avatarR, cy - avatarR, avatarR * 2, avatarR * 2);

  // Avatar inner pattern
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 20, cy - 20, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // Avatar border
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, avatarR + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Initial / name on avatar
  const initial = name.charAt(0);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 110px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, cx, cy + 6);

  // Name
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 56px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.fillText(name, cx, 390);

  // Subject badge
  const badgeW = 180;
  const badgeH = 46;
  const badgeX = cx - badgeW / 2;
  const badgeY = 430;
  ctx.save();
  ctx.fillStyle = `${accent}20`;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 23);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = color;
  ctx.font = 'bold 24px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.fillText(subject, cx, badgeY + badgeH / 2 + 2);

  // Divider line
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 510);
  ctx.lineTo(WIDTH - 80, 510);
  ctx.stroke();

  // Info lines
  ctx.fillStyle = '#4b5563';
  ctx.font = '26px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.fillText('教职工风采', cx, 560);

  ctx.fillStyle = '#9ca3af';
  ctx.font = '20px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.fillText(motto, cx, 600);

  // Footer
  ctx.fillStyle = '#d1d5db';
  ctx.font = '18px "Microsoft YaHei", "SimHei", sans-serif';
  ctx.fillText(`NO. ${String(index + 1).padStart(3, '0')}`, cx, 700);

  // Bottom color strip
  ctx.fillStyle = color;
  ctx.fillRect(0, HEIGHT - 12, WIDTH, 12);

  return canvas;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (let i = 0; i < teachers.length; i++) {
    const canvas = drawCard(teachers[i], i);
    const buffer = await canvas.encode('png');
    const outPath = path.join(OUTPUT_DIR, `teacher-${i + 1}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`Generated ${outPath}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
