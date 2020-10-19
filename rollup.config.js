import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cssbundle from 'rollup-plugin-css-bundle';
import copy from 'rollup-plugin-copy';
import { uglify } from "rollup-plugin-uglify";
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
    resolve(),
    commonjs(),
    json(),
    cssbundle(),
    copy({
      targets: [{
        src: 'node_modules/leaflet.awesome-markers/dist/images/**/*',
        dest: 'public/images/'
      }, 
      {
        src: 'font/**/*.{woff,woff2,ttf}',
        dest: 'public/'
      }]
    }),
    isProduction && uglify(),
    isProduction && terser()
  ]
};
