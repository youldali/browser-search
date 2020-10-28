import webWorkerLoader from 'rollup-plugin-web-worker-loader';

module.exports = {
  rollup(config, options) {
    config.plugins.push(
        webWorkerLoader({
            targetPlatform: 'browser',
            extensions: ['.js', '.ts'],
        }),
    );
    return config;
  },
};