const path = require("path");


// === 可配置变量 ===
/** 
 * 项目名
 * @type {string} 
 */
const PROJECT_NAME = "pocket_chat_github_actions_test";

/** 
 * pocketbase版本
 * @type {string} 
*/
const POCKETBASE_VERSION = "0.33.0";

/** 
 * 打包平台数组
 * @type {string[]} 
 */
const POCKETBASE_PLATFORMS = [
  'darwin_amd64',
  'darwin_arm64',
  'linux_amd64',
  'linux_arm64',
  'linux_armv7',
  'linux_ppc64le',
  'linux_s390x',
  'windows_amd64',
  'windows_arm64',
];

/**
 * pocketbase下载链接拼接函数
 * https://github.com/pocketbase/pocketbase/releases/download/v0.33.0/pocketbase_0.33.0_windows_amd64.zip
 * @param {string} platformStr
 * @returns {string}
 */
const POCKETBASE_DOWNLOAD_URL_FN = (platformStr) => {
  // return `https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${platformStr}.zip`
  // 【251123】为了测试时不再浪费时间下载，临时改为本地模拟的下载链接
  return `http://127.0.0.1:5500/pocketbase_${POCKETBASE_VERSION}_${platformStr}.zip`
}

/** 
 * 要将pocketbase下载到的地方
 * @type {string} 
 */
const POCKETBASE_DOWNLOAD_DIR = path.resolve(__dirname, "../pocketbase-release-file");


// === 导出配置 ===
module.exports = {
  PROJECT_NAME,
  POCKETBASE_VERSION,
  POCKETBASE_PLATFORMS,
  POCKETBASE_DOWNLOAD_URL_FN,
  POCKETBASE_DOWNLOAD_DIR,
};