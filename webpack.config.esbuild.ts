import * as webpack from 'webpack';
import { execute as buildTemplates } from './webpack/config/templates.esbuild';

// const config: webpack.Configuration = {};

const run = function (env: any, argv: any) {
  const mode = argv.mode || 'production';

  return [
    ...buildTemplates(mode,__dirname)
  ];
};

export default run;
