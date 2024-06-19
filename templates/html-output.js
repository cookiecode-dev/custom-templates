// // const data = require('./template.html');
// import * as path from 'path';


// // const z = import('C:\\Users\\ed\\Extern\\CookieCode\\praivacy-cookiescript\\templates\\banner-popup\\template.html');
// // const z = import('./banner-popup/template.html');

// export default function (templateParameters) {
//   JSON.safeStringify = (obj, indent = 2) => {
//     let cache = [];
//     const retVal = JSON.stringify(
//       obj,
//       (key, value) =>
//         typeof value === 'object' && value !== null
//           ? cache.includes(value)
//             ? undefined // Duplicate reference found, discard key
//             : cache.push(value) && value // Store value in our collection
//           : value,
//       indent
//     );
//     cache = null;
//     return retVal;
//   };


//   const anotherFile = new URL('banner-popup/template.html', import.meta.url);
//   const module = import(anotherFile);
//   return JSON.safeStringify(anotherFile);

//   const metaPath = templateParameters.compilation.compiler.options.entry.main.import[0];
//   const templateDir = path.dirname(metaPath);
//   return path.relative(templateDir, __dirname);

//   // const metaPath = templateParameters.compilation.compiler.options.entry.main.import[0];
//   // const templateDir = path.dirname(metaPath);
//   // const file = path.join(templateDir, 'template.html');
//   // const z = import(file);
//   // return z;

//   // return templateParameters.htmlWebpackPlugin.tags.bodyTags.toString();
//   return JSON.safeStringify(templateParameters.compilation.compiler.options.entry.main.import[0]);
// }
