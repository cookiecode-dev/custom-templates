const {
  Compilation,
  sources: { RawSource },
} = require('webpack');
const PluginId = 'MetaJsonAssetPlugin';

const { getHooks } = require('html-webpack-plugin');

class MetaJsonAssetPlugin {
  constructor(fileName) {
    this.fileName = fileName;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PluginId, compilation => {
      getHooks(compilation).alterAssetTags.tap(PluginId, data => {
        const tag = {
          tagName: 'script',
          voidTag: false,
          attributes: { type: 'application/json' },
          innerHTML: compiler.inputFileSystem.readFileSync(this.fileName),
        };

        data.assetTags.scripts.unshift(tag);
      });
    });
  }
}

module.exports = MetaJsonAssetPlugin;
