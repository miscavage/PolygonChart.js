<h1 align="center">
  <a href="http://polygonchart.com">
    <img src="/assets/5-sided-polygon-animation.gif" width="250"/>
  </a>
  <br>
  PolygonChart.js
</h1>

<h4 align="center">Polygon Charting Library | <a href="http://polygonchart.com" target="_blank">polygonchart.com</a></h4>

<p align="center">
  <span class="badge-travisci"><a href="http://travis-ci.org/miscavage/polygonchart.js" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/miscavage/polygonchart.js/master.svg" alt="Travis CI Build Status" /></a></span>
  <span class="badge-npmversion"><a href="https://npmjs.org/package/polygonchart.js" title="View this project on NPM"><img src="https://img.shields.io/npm/v/polygonchart.js.svg" alt="NPM version"/></a></span>
  <span class="badge-npmdownloads"><a href="https://npmjs.org/package/polygonchart.js" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/polygonchart.js.svg" alt="NPM downloads" /></a></span>
  <span class="badge-daviddm"><a href="https://david-dm.org/miscavage/polygonchart.js" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/miscavage/polygonchart.js.svg" alt="Dependency Status" /></a></span>
  <span class="badge-daviddmdev"><a href="https://david-dm.org/miscavage/polygonchart.js#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/miscavage/polygonchart.js.svg" alt="Dev Dependency Status" /></a></span>
</p>

<blockquote align="center">
  <em>PolygonChart.js</em> is a library to graph numerical data using simple polygon SVG visualizations.
  <br>
</blockquote>

<p align="center">
  <a href="#getting-started">Getting started</a>&nbsp;|&nbsp;<a href="#-documentation">Documentation</a>&nbsp;|&nbsp;<a href="#-demos-and-examples">Demos and examples</a>&nbsp;|&nbsp;<a href="#-browser-support">Browser support</a>
</p>

## • Installation

Latest version: 0.0.1

`npm install polygonchart.js`

Install peer dependencies `anime.js` (animations) and `tippjs.js` (tooltips).

## • Demos and Examples

[Basic](https://github.com/miscavage/polygonchart.js/...)

[Animation](https://github.com/miscavage/polygonchart.js/...)

[Square](https://github.com/miscavage/polygonchart.js/...)

[Triangle](https://github.com/miscavage/polygonchart.js/...)

[25 Sided Polygon](https://github.com/miscavage/polygonchart.js/...)

## • Documentation
Below you will find all of the information needed to configure a polygon chart. Included is a detailed analysis of each value, its defaults and some informational examples. You will also find function calls, their parameters and descriptions too.


### options
The value you pass through on instantiation. Below you will find all of the values and defaults for this object.

Type: `Object`

Example usage:

```javascript
let options = {};

let chart = new PolygonChart(options);
chart.init();
```

___

### options.target
This is the element that you pass through as the parent of the svg chart.

Type: `Node`

Default: `null`

Example usage:

```html
<html>
  <main>
    <div id='chart-container'></div>
  </main>

  <style>
    #chart-container {
      display: block;
      width: 400px;
      height: 400px;
    }
  </style>

  <script>
    let element = document.getElementById('chart-container');
    
    let chart = new PolygonChart({
      target: element,
    });
    chart.init();
  </script>
</html>
```

___

### options.radius
The radius of your chart.

Type: `Number`

Default:
```javascript
radius: 200
```

___

### options.data

Values: 

```javascript
data: {
  data: Array,
  sides: Number,
  tooltips: {
    roundTo: Number,
    percentage: Boolean,
  },
  colors: {
    normal: {
      polygonStroke: String,
      polygonFill: String,
      pointStroke: String,
      pointFill: String,
    },
    onHover: {
      polygonStroke: String,
      polygonFill: String,
      pointStroke: String,
      pointFill: String,
    },
  },
}
```

#### options.data.data
This is the `data` that you pass through for the polygon. It is an `array` of `arrays`.

Type: `Array(Array())`

Default:

```javascript
data: []
```


Example (For a 5 sided polygon):

```javascript
{
  data: [
    [
      0.310984
      0.590125,
      0.203583
      0.420541,
      0.159303
    ],
  ],
}
```


#### options.data.sides
The number of sides the polygon has. This overrides any number of data points in the `options.data.data` value.

Type: `Number`

Default:

```javascript
sides: 0
```


Example (For a 5 sided polygon):

```javascript
{
  sides: 5
}
```


#### options.data.tooltips
The data tooltips for each point. Contains flags for manipulating the tooltip values.

Type: `Object`

Default:

```javascript
{
  roundTo: 0,
  percentage: false,
}
```

- `options.data.tooltips.roundTo`: `Number` - The number value to round to for the tooltip.
- `options.data.tooltips.percentage`: `Boolean` - Whether or not to include "%" at the end of the tooltip value.


#### options.data.colors
The colors for the polygon data. You can set the `normal` and `onHover` colors.

Type: `Object`

Default: 

```javascript
{
  normal: {
    polygonStroke: '#1e3d96',
    polygonFill: 'rgba(39, 78, 192,.5)',
    pointStroke: 'transparent',
    pointFill: '#1e3d96',
  },
  onHover: {
    polygonStroke: '#1a3480',
    polygonFill: 'rgba(39, 78, 192,.85)',
    pointStroke: 'transparent',
    pointFill: '#1a3480',
  },
}
```

- `polygonStroke`: `String` - The stroke color of the data polygon
- `polygonFill`: `String` - The fill color of the data polygon
- `pointStroke`: `String` - The stroke color of the data point
- `pointFill`: `String` - The fill color of the data point

___

### options.polygon

Values: 

```javascript
polygon: {
  colors: {
    normal: {
      fill: String,
      stroke: String,
    },
    onHover: {
      fill: String,
      stroke: String,
    }
  }
}
```

#### options.polygon.colors
The colors for the polygon data. You can set the `normal` and `onHover` colors.

Type: `Object`

Default: 

```javascript
{
  normal: {
    fill: '#fff',
    stroke: '#8c8c8c',
  },
  onHover: {
    splineFill: '#fff',
    splineStroke: '#000',
  },
}
```

- `fill`: `String` - The fill color of the polygon graph
- `stroke`: `String` - The stroke color of the polygon graph

___

### options.levels

Values: 

```javascript
levels: {
  count: Number,
  labels: {
    enabled: Boolean,
    position: {
      spline: Number,
      quadrant: Number,
    },
    colors: {
      normal: String,
      onHover: String,
    },
  },
},
```

#### options.levels.count
The number of levels the polygon graph has. This is the number of inner polygons. Think of these as percentages in the graph. For example, with `count` of `5`, there will be 5 inner polygons (The labels would be then: [`10%`, `20%`, `30%`, `40%`, `50%`]).

Type: `Number`

Default:

```javascript
count: 5
```

#### options.levels.labels
The labels block contains flags for manipulating the level's labels.

Type: `Object`

#### options.levels.labels.enabled
Whether or not to display the labels of the percentages for each level. From the above `options.levels.count`, with a `count` of `5`, there will be 5 inner polygons (The labels would be then: [`10%`, `20%`, `30%`, `40%`, `50%`]).

Type: `Boolean`

Default:

```javascript
enabled: true
```

#### options.levels.labels.position
Configure where to position the labels for each level. The `quadrant` value overrides the `spline` value.

Type: `Object`

Default: 

```javascript
{
  spline: 1,
  quadrant: 0,
}
```

- `spline`: `Number` - The spline to position the labels on. Min: `0`. Max: `options.data.sides`
- `quadrant`: `Number` - The quadrant to position the labels in. Min: `0`. Max: `options.data.sides`

#### options.levels.labels.colors
The colors for the level labels. You can set the `normal` and `onHover` colors.

Type: `Object`

Default: 

```javascript
{
  normal: '#8c8c8c',
  onHover: '#000',
}
```

- `normal`: `String` - The text color
- `onHover`: `String` - The text color on hover of a inner polygon

___

### options.tippy
Options to pass through for tippy.js instantiation. For more information, please refer to tippy.js documentation: 

Type: `Object`

Default: 

```javascript
tippy: {}
```

___

### options.anime
Options to pass through for anime.js instantiation. For more information, please refer to anime.js documentation: 

Type: `Object`

Default: 

```javascript
anime: {
  duration: 10000,
  easing: 'linear',
}
```

___

### options.animation
Options to pass through for animation of the data polygon.

Values: 

```javascript
animation: {
  autoplay: Boolean,
}
```

### options.animation.autoplay
Whether or not to automatically play the animation after the graph's instantiation.

Type: `Boolean`

Default: 

```javascript
autoplay: false
```

### • Functions
After instantiation, your `PolygonChart` instance will expose the following functions for you to use. Each of the functions return `self` which allows you to chain functions if you wish.

Example usage:

```javascript
let chart = new PolygonChart();
chart.init();
```

#### init()
This is the instantiation function that must be called after you create a new `PolygonChart` instance.

Example usage:

```javascript
let chart = new PolygonChart();
chart.init();
```

#### startAnimation()
This function only works if you have included `anime.js`. It uses `anime.js` `play()` function to play the data animation. For more information, please refer to the documentation here: 

Example usage:

```javascript
let chart = new PolygonChart();
chart.startAnimation();
```

#### resetAnimation()
This function only works if you have included `anime.js`. It uses `anime.js` `restart()` and `pause()` functions to restart the data animation. For more information, please refer to the documentation here for `restart()`: and `pause()`:

Example usage:

```javascript
let chart = new PolygonChart();
chart.resetAnimation();
```

#### stopAnimation()
This function only works if you have included `anime.js`. It uses `anime.js` `pause()` function to stop the data animation. For more information, please refer to the documentation here: 

Example usage:

```javascript
let chart = new PolygonChart();
chart.stopAnimation();
```

#### seekAnimation()
This function only works if you have included `anime.js`. It uses `anime.js` `seek()` function to jump to a specific point in time in the data animation. For more information, please refer to the documentation here: 

Example usage:

```javascript
let chart = new PolygonChart();
chart.seekAnimation(4000);
```

#### reload()
This function reloads your `PolygonChart` instance. For example, if you edit any of the `options` values, you can call `reload()` to make sure the changes take effect.

Example usage:

```javascript
let chart = new PolygonChart();
chart.reload();
```

## • Browser Support

| Chrome | Safari | IE / Edge | Firefox | Opera |
| --- | --- | --- | --- | --- |
| 24+ | 8+ | 11+ | 32+ | 15+ |

## • Say Hi

Find me on Gab: [@markmiscavage](https://gab.com/markmiscavage).

Tweet at me: [@markmiscavage](https://twitter.com/markmiscavage).

## • License

MIT License

Copyright (c) 2020 Mark Miscavage

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
