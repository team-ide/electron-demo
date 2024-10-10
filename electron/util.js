const options = require("./options.js");

const resolveHtmlPath = (htmlFileName) => {
  if (options.isDev) {
    const port = process.env.PORT;
    const url = new URL(`http://127.0.0.1:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${options.getRootPath('dist/', htmlFileName)}`;
}


module.exports = {
  resolveHtmlPath,
  getAssetPath: options.getAssetPath,
  getRootPath: options.getRootPath,
}

