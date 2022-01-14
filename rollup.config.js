import resolve from 'rollup-plugin-node-resolve';
import babelPlugin from "rollup-plugin-babel";
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript({ 
      useTsconfigDeclarationDir: true 
    }),
    commonjs(),
    babelPlugin({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    terser(),
  ]
};