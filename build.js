const fs = require('fs');
const path = require('path');

const linksFile = path.join(__dirname, 'links.json');
const outputDir = path.join(__dirname, 'dist');

// 读取短链配置
const links = JSON.parse(fs.readFileSync(linksFile, 'utf-8'));

// 清理并创建输出目录
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 生成404页面
function generate404Page(shortPath) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 - 短链不存在</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      color: #333;
    }
    .card {
      text-align: center;
      padding: 3rem 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 400px;
      width: 90%;
    }
    .code { font-size: 5rem; font-weight: 700; color: #e74c3c; line-height: 1; }
    h1 { margin: 1rem 0 0.5rem; font-size: 1.4rem; }
    p { color: #888; font-size: 0.95rem; margin-bottom: 1.5rem; }
    code { background: #f0f0f0; padding: 0.15em 0.4em; border-radius: 4px; }
    a {
      display: inline-block;
      padding: 0.6rem 1.4rem;
      background: #333;
      color: #fff;
      border-radius: 0.5rem;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    a:hover { background: #555; }
  </style>
</head>
<body>
  <div class="card">
    <div class="code">404</div>
    <h1>短链不存在</h1>
    <p>路径 <code>${shortPath}</code> 没有对应的跳转目标。</p>
    <a href="https://yourblog.example.com">回到博客 →</a>
  </div>
</body>
</html>`;
}

// 生成跳转页面
function generateRedirectPage(targetUrl) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="0; url=${targetUrl}" />
  <title>正在跳转...</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      color: #333;
    }
    .card {
      text-align: center;
      padding: 3rem 2rem;
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 400px;
      width: 90%;
    }
    p { color: #666; font-size: 1rem; margin-bottom: 1.5rem; }
    a {
      display: inline-block;
      padding: 0.6rem 1.4rem;
      background: #333;
      color: #fff;
      border-radius: 0.5rem;
      text-decoration: none;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    a:hover { background: #555; }
  </style>
</head>
<body>
  <div class="card">
    <p>正在跳转到 <a href="${targetUrl}">${targetUrl}</a></p>
    <script>window.location.replace("${targetUrl}");</script>
  </div>
</body>
</html>`;
}

// 生成选择页面
function generateChoicePage(config) {
  const optionsHtml = config.options.map((option, index) => {
    return `
      <a href="${option.url}" class="option-card" data-index="${index}">
        <div class="option-label">${option.label}</div>
        <div class="option-desc">${option.description}</div>
      </a>`;
  }).join('\n      ');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh;
      background: #f8f9fa;
      color: #333;
      padding: 2rem 1rem;
    }
    .container {
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    h1 {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      color: #222;
    }
    .option-card {
      display: block;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: #fff;
      border-radius: 0.75rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      text-decoration: none;
      color: #333;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }
    .option-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border-color: #333;
    }
    .option-label {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }
    .option-desc {
      font-size: 0.9rem;
      color: #888;
    }
    .back-link {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.5rem 1rem;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    .back-link:hover {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${config.title}</h1>
    ${optionsHtml}
    <a href="https://yourblog.example.com" class="back-link">← 回到博客</a>
  </div>
</body>
</html>`;
}

// 生成所有短链页面
console.log('开始生成静态页面...');

Object.entries(links).forEach(([shortPath, target]) => {
  // 处理路径：去掉开头的斜杠
  const cleanPath = shortPath.startsWith('/') ? shortPath.slice(1) : shortPath;
  
  // 创建目录结构
  const targetDir = path.join(outputDir, cleanPath);
  fs.mkdirSync(targetDir, { recursive: true });
  
  let htmlContent;
  
  // 检查是否为选择页面配置
  if (typeof target === 'object' && target.type === 'choice') {
    htmlContent = generateChoicePage(target);
    console.log(`✓ 生成: /${cleanPath}/index.html -> 选择页面 (${target.title})`);
  } else {
    // 普通重定向
    htmlContent = generateRedirectPage(target);
    console.log(`✓ 生成: /${cleanPath}/index.html -> ${target}`);
  }
  
  const htmlFilePath = path.join(targetDir, 'index.html');
  fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
});

// 生成自定义404页面（Cloudflare Pages会使用404.html）
const notFoundHtml = generate404Page('/不存在的短链');
fs.writeFileSync(path.join(outputDir, '404.html'), notFoundHtml, 'utf-8');
console.log('✓ 生成: 404.html');

console.log(`\n完成！共生成 ${Object.keys(links).length} 个短链页面`);
console.log(`输出目录: ${outputDir}`);
