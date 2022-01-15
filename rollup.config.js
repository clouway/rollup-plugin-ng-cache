import { babel } from '@rollup/plugin-babel';
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

var pkg = require('./package.json')
var external = Object.keys(pkg.dependencies);

export default {
    input: 'index.js',
    output: [
        {
            file: pkg['main'],
            format: 'cjs',
            exports: 'named',

        },
        {
            file: pkg['jsnext:main'],
            format: 'es',
            exports: 'named',
        }
    ],
    plugins: [
        commonjs({}),
        nodeResolve({}),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        })
    ],
    external: external,
};