/**
 * @author: @AngularClass
 */

// Look in ./config folder for webpack.dev.js
switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = require('./config/webpack.prod')({env: 'production'});
    break;
  case 'test':
  case 'testing':
    module.exports = require('./config/webpack.test')({env: 'test'});
    break;
  case 'dev':
  case 'development':
  default:
    module.exports = require('./config/webpack.dev')({env: 'development'});
}

var API_URL = {
  prod: JSON.stringify('http://hypeweb.iypuat.com:5656/'),
  production: JSON.stringify('http://hypeweb.iypuat.com:5656/'),
  dev: JSON.stringify('dev-url'),
  development: JSON.stringify('dev-url'),
  test: JSON.stringify('test-url'),
  testing: JSON.stringify('test-url')
};

// check environment mode
var environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

// webpack config
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'API_URL': API_URL[environment]
    })
  ]
}