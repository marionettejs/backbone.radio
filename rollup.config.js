import babel from '@rollup/plugin-babel';
import { eslint } from 'rollup-plugin-eslint';

const globals = {
  'underscore': '_',
};

const pkg = require('./package.json');
const external = Object.keys(pkg.peerDependencies);

export default [
  {
    input: 'src/index.js',
    external,
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: 'Radio',
        exports: 'named',
        sourcemap: true,
        globals
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      eslint(),
      babel()
    ]
  },
];
