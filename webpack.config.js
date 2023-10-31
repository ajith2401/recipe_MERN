const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },
};
