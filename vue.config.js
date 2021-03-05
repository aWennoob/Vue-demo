// const px2rem = require('postcss-px2rem')

module.exports = {
//   css: {
//     loaderOptions: {
//       postcss: {
//         plugins: [
//           px2rem({
//             remUnit: 37.5
//           })
//         ]
//       }
//     }
//   },
  productionSourceMap:false,
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        }
      },
     
    }
  }
}