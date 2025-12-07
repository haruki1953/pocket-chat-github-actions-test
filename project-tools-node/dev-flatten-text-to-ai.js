/**
 * dev-flatten-text-to-ai.js
 *
 * 📌 脚本用途：
 * 将指定文件或文件夹（递归遍历子文件夹）中的源代码文件内容扁平化整合，
 * 输出为一个单独的 `.txt` 文件，方便与 AI 进行项目内容交流。
 *
 * 🛠️ 功能说明：
 * 1. 接收一个绝对路径参数（文件或文件夹）。
 * 2. 遍历路径下所有文件，筛选出符合指定扩展名的文件（可在 FILE_TYPES 中配置）。
 * 3. 将每个文件的绝对路径与内容写入到一个 txt 文件中，格式如下：
 *
 *    【文件绝对路径】
 *
 *    文件文本内容
 *
 *
 *    【文件绝对路径】
 *
 *    文件文本内容
 *
 *    （文件之间空两行）
 *
 * 4. 输出文件名规则：
 *    - 前缀：当前时间戳，格式 `YYYYMMDD-HHmmss-SSS_`
 *    - 后缀：将输入路径转换为合法文件名（斜杠、反斜杠、冒号替换为下划线）
 *    - 示例：`20251207-181533-000_C__Users_Haruki_Desktop_myproject.txt`
 *
 * 📂 输出位置：
 * - 统一生成在项目根目录下的 `temp/` 文件夹中。
 *
 * ⚙️ 可配置变量：
 * - FILE_TYPES: string[] → 需要处理的文件类型扩展名数组，例如 ['.js', '.ts', '.vue']
 *
 * 🚀 使用方法：
 *   node project-tools-node/dev-flatten-text-to-ai.js "绝对路径"
 *
 *   示例：
 *   node project-tools-node/dev-flatten-text-to-ai.js "C:/Users/Haruki/Desktop/myproject"
 *
 * 📑 注意事项：
 * - 输入路径必须为绝对路径。
 * - 如果输入的是文件，则仅处理该文件。
 * - 如果输入的是文件夹，则递归遍历所有子文件夹。
 * - 若没有找到符合条件的文件，脚本会提示并退出。
 *
 */

const fs = require("fs");
const path = require("path");

/**
 * 可配置变量：要处理的文件类型
 * @type {string[]}
 */
const FILE_TYPES = [".js", ".ts", ".vue"];

/**
 * 获取当前时间字符串，格式：YYYYMMDD-HHmmss-SSS
 * @returns {string}
 */
function getTimestampPrefix() {
  const now = new Date();
  const pad = (/** @type {number} */ n, width = 2) => String(n).padStart(width, "0");
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "-" +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    "-" +
    pad(now.getMilliseconds(), 3)
  );
}

/**
 * 将路径转换为合法文件名（替换斜杠、反斜杠、冒号等）
 * @param {string} inputPath
 * @returns {string}
 */
function sanitizeFileName(inputPath) {
  return inputPath.replace(/[\\/:\s]/g, "_");
}

/**
 * 遍历文件夹，收集所有符合类型的文件
 * @param {string} targetPath
 * @returns {string[]} 文件绝对路径数组
 */
function collectFiles(targetPath) {
  /** @type {string[]} */
  const results = [];

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    if (FILE_TYPES.some(ext => targetPath.endsWith(ext))) {
      results.push(targetPath);
    }
  } else if (stat.isDirectory()) {
    const entries = fs.readdirSync(targetPath);
    for (const entry of entries) {
      const fullPath = path.join(targetPath, entry);
      results.push(...collectFiles(fullPath));
    }
  }
  return results;
}

/**
 * 将文件内容整合为 txt
 * @param {string[]} files
 * @returns {string}
 */
function buildOutput(files) {
  let output = "";
  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    output += `${file}\n\n${content}\n\n\n`;
  }
  return output;
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("请提供一个文件或文件夹的绝对路径作为参数");
    process.exit(1);
  }

  const targetPath = path.resolve(args[0]);
  const files = collectFiles(targetPath);

  if (files.length === 0) {
    console.error("没有找到符合条件的文件");
    process.exit(1);
  }

  const timestamp = getTimestampPrefix();
  const baseName = sanitizeFileName(targetPath);
  const outputFileName = `${timestamp}_${baseName}.txt`;

  const outputContent = buildOutput(files);
  const outputPath = path.join(process.cwd(), "temp", outputFileName);

  // 确保 temp 文件夹存在
  fs.mkdirSync(path.join(process.cwd(), "temp"), { recursive: true });

  fs.writeFileSync(outputPath, outputContent, "utf-8");

  // ✅ 新增：输出处理过的文件列表
  console.log("已处理以下文件：");
  for (const file of files) {
    console.log(" - " + file);
  }

  console.log(`\n已生成文件: ${outputPath}`);
}

main();
