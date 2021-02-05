const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    port: 3000,
    proxy: {
      '/subcenters': {
        // target: 'http://192.168.11.216:8086/subcenters/',
        // target: 'http://60.191.5.236:8090/subcenters/',
        target: '',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/subcenters': ''
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        api: resolve('src/api'),
        assets: resolve('src/assets'),
        images: resolve('src/assets/image'),
        util: resolve('src/assets/js/util/index.js'),
        views: resolve('src/views'),
        mixins: resolve('src/mixins'),
        tongwoo: resolve('src/tongwoo'),
        components: resolve('src/components')
      }
    },
    externals: {
      AMap: 'AMap',
      AMapUI: 'AMapUI'
    }
  }
}
