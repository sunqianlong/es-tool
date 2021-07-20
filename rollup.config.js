import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import {eslint} from 'rollup-plugin-eslint'
import {terser} from "rollup-plugin-terser";

const isDev = process.env.NODE_ENV !== 'production';

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: './dist/tool.cjs.js',
                format: 'cjs'

            }, {
                file: './dist/tool.es.js',
                format: 'es'

            }, {
                file: './dist/tool.umd.js',
                format: 'umd',
                name: 'file'
            }],
        external: ['lodash','ms'],
        globals: {
            lodash: '_'
        },
        plugins: [
            resolve(), // 这样 Rollup 能找到 `ms`
            commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
            eslint(),
            babel({
                exclude: 'node_modules/**', // 防止打包node_modules下的文件
                runtimeHelpers: true,       // 使plugin-transform-runtime生效
            }),
            !isDev && terser(),
            eslint({
                throwOnError: true,
                throwOnWarning: true,
                include: ['src/**'],
                exclude: ['node_modules/**']
            })

        ]
    }
]
