// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = (app) => {
  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/logmonitor/api/v1',
      createProxyMiddleware({
        target: 'http://localhost:8080',
        changeOrigin: true,
      })
    );

    // app.use(
    //   '/cras',
    //   createProxyMiddleware({
    //     // target: 'http://10.1.31.235:5000',
    //     target: 'http://10.1.36.104:5000',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/cras': '', // URL ^/cras -> 공백 변경
    //     },
    //   })
    // );
  }
};
