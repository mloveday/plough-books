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
    })

// totally not different
  .enableSourceMaps(!Encore.isProduction())
;

const config = Encore.getWebpackConfig();
config.resolve.alias = {
  env: path.resolve(Encore.isProduction() ? 'assets/env/prod' : 'assets/env/dev')
};
config.name = 'default';

// duplicate of above until obvious comment
Encore.reset();
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
    from: './assets/images'
  })

// totally not different
  .enableSourceMaps(false)
;

const personalConfig = Encore.getWebpackConfig();
personalConfig.resolve.alias = {
  env: path.resolve('assets/env/personal')
};
personalConfig.name = 'personal';


module.exports = [config, personalConfig];
