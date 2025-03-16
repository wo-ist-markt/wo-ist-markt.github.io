import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

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
    resolve({
      browser: true
    }),
    commonjs(),
    json(),
    isProduction && terser({
      mangle: {
        module: true,
      }
    }),
    css({
      output: 'bundle.css',
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
