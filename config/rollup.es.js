import path from 'path';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import pkg from '../package.json';

const useLocal = (mod) => path.resolve(__dirname, '../node_modules', mod);

export const babelOpts = {
  babelrc: false,
  exclude: 'node_modules/**',
  runtimeHelpers: true,
  presets: [
    [useLocal('@babel/preset-env'), { modules: false }],
    useLocal('@babel/preset-react'),
  ],
  plugins: [
    useLocal('@babel/plugin-proposal-class-properties'),
    useLocal('@babel/plugin-transform-runtime'),
  ],
};

export const external = [
  ...Object.keys(pkg.dependencies),
  '@babel/runtime/helpers/asyncToGenerator',
  '@babel/runtime/helpers/toConsumableArray',
  '@babel/runtime/helpers/classCallCheck',
  '@babel/runtime/helpers/defineProperty',
  '@babel/runtime/regenerator',
  '@babel/runtime/helpers/slicedToArray',
  '@politico/interactive-bin/dist/scripts/env',
  'lodash/startCase',
  'lodash/assign',
  'lodash/keys',
  'lodash/debounce',
  'lodash/merge',
  'lodash/findIndex',
  'lodash/uniq',
  'lodash/flatten',
  'lodash/merge',
  'child_process',
  'os',
  'path',
  'url',
  'form-data',
  'aws-sdk',
  'chrome-aws-lambda',
  'puppeteer-core',
  'http',
  'crypto',
  'querystring',
  'https',
];

export const plugins = [
  alias({
    resolve: ['.jsx', '.js'],
    Utils: path.resolve(__dirname, '../src/utils'),
    Constants: path.resolve(__dirname, '../src/constants'),
    Scripts: path.resolve(__dirname, '../src/scripts'),
    Middleware: path.resolve(__dirname, '../src/middleware'),
    Root: path.resolve(__dirname, '..'),
  }),
  babel(babelOpts),
  json(),
  resolve({
    preferBuiltins: true,
    extensions: ['.js', '.jsx'],
    modulesOnly: true,
  }),
];

export default [
  {
    input: [
      path.resolve(process.cwd(), 'src/index.js'),
    ],
    output: [
      { file: path.resolve(process.cwd(), pkg.main), format: 'cjs' },
      { file: path.resolve(process.cwd(), pkg.module), format: 'es' },
    ],
    external,
    plugins,
  },
];
