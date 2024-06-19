const memfs = require('memfs');
const { Volume } = require('memfs');
const fs = require('fs');
const { ufs } = require('unionfs');

function HtmlFileSystemPlugin() {}

HtmlFileSystemPlugin.prototype.apply = function (compiler) {
  const compilers = compiler.compilers || [compiler];

  // const fs = Volume.fromJSON('/dist');
  const vol1 = Volume.fromJSON({ '/dist/index.html': '1' });
  ufs.use(vol1).use(fs);

  for (const compiler of compilers) {
    compiler.outputFileSystem = ufs;
  }
};

module.exports = HtmlFileSystemPlugin;
