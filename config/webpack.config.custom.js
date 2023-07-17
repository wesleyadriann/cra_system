const CopyPlugin = require("copy-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const paths = require("./paths");


/** @return {import('webpack').Configuration} */
module.exports = function (webpackEnv) {
  const isProductionBuild = webpackEnv === "production";

  const systemFile = `system${isProductionBuild ? '.min' : ''}.js`
  const systemAmdFile = `amd${isProductionBuild ? '.min' : ''}.js`

  const pathImportMap = `${paths.publicUrlOrPath}maps/${isProductionBuild ? 'index' : 'local'}.json`

  return {
    output: {
      libraryTarget: "system",
    },
    plugins: [
      new CopyPlugin({
        patterns: [
        {
          from: `${paths.appPath}/node_modules/systemjs/dist/${systemFile}`,
          to: `${paths.appBuild}/static/js/[name][ext]`,
        },
        {
          from: `${paths.appPath}/node_modules/systemjs/dist/extras/${systemAmdFile}`,
          to: `${paths.appBuild}/static/js/[name][ext]`,
        }
        ]
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
        PATH_SYSTEM: `${paths.publicUrlOrPath}static/js/${systemFile}`,
        PATH_SYSTEM_AMD: `${paths.publicUrlOrPath}static/js/${systemAmdFile}`,
        PATH_IMPORT_MAP: pathImportMap
      }),
    ],
  };
};
