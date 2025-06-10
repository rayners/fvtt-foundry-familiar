import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

export default {
  input: 'src/module.ts',
  output: {
    file: 'dist/module.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    typescript({
      sourceMap: true,
      declaration: false
    }),
    scss({
      fileName: 'styles/familiar.css',
      outputStyle: 'compressed',
      watch: 'src/styles',
      verbose: false
    }),
    copy({
      targets: [
        { src: 'module.json', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'CHANGELOG.md', dest: 'dist' },
        { src: 'languages/*', dest: 'dist/languages' },
        { src: 'templates/*', dest: 'dist/templates' }
      ]
    }),
    ...(isDevelopment ? [
      serve({
        contentBase: 'dist',
        port: 30001
      }),
      livereload('dist')
    ] : [])
  ],
  external: []
};