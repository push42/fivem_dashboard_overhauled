const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy all API requests to the PHP backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://fivem_dashboard.test',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.log('Proxy error:', err.message);
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.method, req.url);
      },
    })
  );
};
