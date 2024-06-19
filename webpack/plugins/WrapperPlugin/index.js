const ConcatSource = require("webpack-sources").ConcatSource;
const ModuleFilenameHelpers = require("webpack/lib/ModuleFilenameHelpers");

class WrapperPlugin {
	constructor(args) {
		if (typeof args !== 'object') {
			throw new TypeError('Argument "args" must be an object.');
		}

		this.header = args.hasOwnProperty('header') ? args.header : '';
		this.footer = args.hasOwnProperty('footer') ? args.footer : '';
		this.test = args.hasOwnProperty('test') ? args.test : '';
	}

	apply(compiler) {
		const header = this.header;
		const footer = this.footer;
		const tester = {test: this.test};

		compiler.hooks.thisCompilation.tap('WrapperPlugin', (compilation) => {
			if (compilation.hooks.processAssets) {
				compilation.hooks.processAssets.tap(
					{
						name: 'WrapperPlugin',
						//stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS, 
						stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE, 
					},
					(chunks) => wrapChunks(compilation, chunks),
				);
				return;
			}

			compilation.hooks.optimizeChunkModules.tap('WrapperPlugin', (chunks) =>
				wrapChunks(compilation, chunks)
			);
		});

		function wrapFile(compilation, fileName, chunkHash) {
			const headerContent = (typeof header === 'function') ? header(fileName, chunkHash) : header;
			const footerContent = (typeof footer === 'function') ? footer(fileName, chunkHash) : footer;
			compilation.updateAsset(fileName, new ConcatSource(
				String(headerContent),
				compilation.getAsset(fileName).source.buffer().toString(),
				String(footerContent),
			))
		}

		function wrapChunks(compilation, chunks) {
			Object.keys(chunks).forEach(fileName => {
				if (ModuleFilenameHelpers.matchObject(tester, fileName)) {
					wrapFile(compilation, fileName, compilation.hash);
				}
			})
		}
	}
}

module.exports = WrapperPlugin;
