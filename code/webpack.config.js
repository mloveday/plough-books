var path = require('path');
const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('../public_html/build/')
    .setPublicPath('/build')

    .addEntry('app', './assets/index.tsx')
    .enableSingleRuntimeChunk()

    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableVersioning(Encore.isProduction())
    .enableSassLoader()
    .enableTypeScriptLoader()
    .enableReactPreset()
    .copyFiles({
        from: './assets/images',
        // optional target path, relative to the output dir
        //to: 'images/[path][name].[ext]',
        // only copy files matching this pattern
        //pattern: /\.(png|jpg|jpeg)$/
    })
;

const config = Encore.getWebpackConfig();
config.resolve.alias = {
  env: path.resolve(Encore.isProduction() ? 'assets/env/prod' : 'assets/env/dev')
};
config.useSourceMaps = true;
config.name = 'default';

const personalConfig = Encore.getWebpackConfig();
personalConfig.resolve.alias = {
  env: path.resolve('assets/env/personal')
};
config.useSourceMaps = false;
personalConfig.name = 'personal';


module.exports = [config, personalConfig];
