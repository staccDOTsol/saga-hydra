const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
      fs: require.resolve('react-native-fs'),
      path: require.resolve('path-browserify'),
      os: false,
      assert: require.resolve('assert'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('react-native-crypto'),
        vm: require.resolve('vm-browserify'),
        process: require.resolve('process/browser'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('react-zlib-js'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        constants: require.resolve('constants-browserify'),
        dns: require.resolve('dns.js'),
        events: require.resolve('events'),
        // yarn add stream-browserify crypto browserify-zlib react-native-crypto vm-browserify process stream-http https-browserify url react-zlib-js buffer util constants-browserify  dns.js
        // thanks copilot
        // 
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);