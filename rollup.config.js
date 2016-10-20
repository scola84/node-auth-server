import buble from 'rollup-plugin-buble';

export default {
  dest: './dist/auth-server.js',
  entry: 'index.js',
  format: 'cjs',
  external: [
    '@scola/auth-common',
    '@scola/error',
    'bcrypt',
    'fs',
    'jsonwebtoken',
    'useragent'
  ],
  plugins: [
    buble()
  ]
};
