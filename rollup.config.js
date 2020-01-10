import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';
import pkg from './package.json';

const packageInfo = `${pkg.name}@v${pkg.version}`;

export default [
  {
    input: 'src/PolygonChart.js',
    plugins: [
      resolve(),
      commonjs(),
      minify({}),
    ],
    output: [
      {
        name: 'PolygonChart',
        file: pkg.browser,
        format: 'umd',
        banner: `/* ${packageInfo} (umd) */`,
      },
      {
        name: 'PolygonChart',
        file: pkg.main,
        format: 'cjs',
        banner: `/* ${packageInfo} (cjs) */`,
      },
      {
        name: 'PolygonChart',
        file: pkg.module,
        format: 'es',
        banner: `/* ${packageInfo} (es) */`,
      },
    ],
  },
];
