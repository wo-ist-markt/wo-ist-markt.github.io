import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cssbundle from 'rollup-plugin-css-bundle';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'js/main.js',
  output: {
    file: 'public/bundle.js',
    name: 'WoIstMarkt',
    format: 'iife',
    sourcemap: !isProduction
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    isProduction && terser({
      mangle: {
        module: true,
      }
    }),
    cssbundle({
      transform: code => postcss([postcssImport]).process(code, {
        from: "css/main.css"
      })
    }),
    copy({
      targets: [{
        src: 'node_modules/leaflet.awesome-markers/dist/images/**/*',
        dest: 'public/images/'
      },
      {
        src: 'font/**/*.{woff,woff2,ttf}',
        dest: 'public'
      }]
    })
  ]
};
