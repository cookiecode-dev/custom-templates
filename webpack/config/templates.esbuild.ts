import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';

import VirtualModulesPlugin from 'webpack-virtual-modules';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';
import MetaAssetPlugin from '../plugins/MetaAssetPlugin';

export function execute(mode: 'development' | 'production', rootDir: string): webpack.Configuration[] {
  const defaults: webpack.Configuration = {
    mode,
    devtool: mode === 'development' ? 'eval-source-map' : false,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, '..', 'loaders')],
    },
  };

  return [
    { ...defaults, ...createJavascriptTemplateConfig(rootDir, 'dialog-diy-minimal') },
    { ...defaults, ...createJavascriptTemplateConfig(rootDir, 'dialog-simple') },
    { ...defaults, ...createJavascriptTemplateConfig(rootDir, 'dialog-air') },
    { ...defaults, ...createHtmlTemplateConfig(rootDir, 'banner-popup') },
    { ...defaults, ...createHtmlTemplateConfig(rootDir, 'banner-classic') },
    { ...defaults, ...createHtmlTemplateConfig(rootDir, 'banner-diy-minimal') },
  ];
}

const createJavascriptTemplateConfig = function (rootDir: string, name: string): webpack.Configuration {
  const templateDir = path.resolve(rootDir, 'templates', name);
  const resolvePath = (subPath: string) => path.join(templateDir, subPath);

  return {
    name: 'template-' + name,
    entry: templateDir,
    output: {
      path: path.resolve(rootDir, 'dist', 'templates', name),
      filename: 'template.js',
    },
    module: {
      rules: [vueRule, javascriptRule, scssRule, assetSourceRole],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(rootDir, 'templates', 'js-output.ejs'),
        filename: 'default.html',
        inject: false,
        meta: false,
        scriptLoading: 'blocking',
        minify: false,
        cache: false,
      }),
      new HtmlInlineScriptPlugin(),
      new MetaAssetPlugin(resolvePath('meta.json')),
    ],
  };
};

const createHtmlTemplateConfig = function (rootDir: string, name: string): webpack.Configuration {
  const templateDir = path.resolve(rootDir, 'templates', name);
  const resolvePath = (subPath: string) => path.join(templateDir, subPath);

  const htmlTemplate = `
  import templateMeta from './meta.json';
  import templateSource from './template.html';

  import templateStyle from './template.scss';
  const style = templateStyle.length > 0 ? '<style>\\n' + templateStyle + '\\n</style>' : '';

  export default function () {
    return \`<script type="application/json">\${templateMeta}</script>
    \${templateSource}
    \${style}\`;
  }
  `;

  const virtualModules = {
    [resolvePath('__entry.js')]: '',
    [resolvePath('__html_template.js')]: htmlTemplate,
  }

  if (!fs.existsSync(resolvePath('template.scss'))) {
    virtualModules[resolvePath('template.scss')] = ' ';
  }

  return {
    name: 'template-' + name,
    entry: resolvePath('__entry.js'), // We don't really use the input
    output: {
      path: path.resolve(rootDir, 'dist', 'templates', name),
      filename: 'template.js',
    },
    module: {
      rules: [scssAsStringRule, assetSourceRole],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolvePath('__html_template.js'),
        filename: 'default.html',
        inject: false,
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: true,
          keepClosingSlash: true,
          removeComments: true,
          processScripts: ['application/json'],
          // minifyCSS: false,
        },
        cache: false,
      }),
      new VirtualModulesPlugin(virtualModules),
      new IgnoreOutputAssetPlugin(),
    ],
    optimization: {
      removeEmptyChunks: false,
      providedExports: false,
    },
  };
};

const javascriptRule: webpack.RuleSetRule = {
  test: /\.m?[j|t]s$/,
  exclude: /node_modules/,
  use: {
    loader: 'esbuild-loader',
    options: {
      loader: 'ts',
      target: 'es2015',
    },
  },
};

const vueRule: webpack.RuleSetRule = {
  test: /\.vue$/,
  loader: 'vue-loader',
  options: { customElement: true },
};

const scssRule: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [
    // No style loader needed
    'css-loader',
    'sass-loader',
  ],
};

const scssAsStringRule: webpack.RuleSetRule = {
  test: /\.scss$/,
  use: [
    {
      loader: 'css-loader',
      options: {
        exportType: 'string',
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          // https://github.com/sass/node-sass#outputstyle
          outputStyle: 'compressed',
        },
      },
    },
  ],
};

const assetSourceRole: webpack.RuleSetRule = {
  test: /\.(svg|svg|html|json)$/i,
  type: 'asset/source',
};

class IgnoreOutputAssetPlugin {
  constructor() {}

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap('IgnoreOutputAssetPlugin', compilation => {
      const outputFilename = compilation.outputOptions.filename as string;
      compilation.hooks.processAssets.tap(
        { name: 'IgnoreOutputAssetPlugin', stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS },
        () => compilation.deleteAsset(outputFilename)
      );
    });
  }
}
