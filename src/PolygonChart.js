function PolygonChart(options) {
  const scope = this;

  //

  const toRad = (degree) => ((parseFloat(degree) * Math.PI) / 180);

  //

  const ElementFactory = {

    makeCircle: (params = {}) => {
      const opts = Object.assign({
        fill: 'transparent',
        stroke: 'none',
        radius: 0,
        strokeWidth: '0',
      }, params);

      const circle = ElementFactory.createSVGElement('circle');
      circle.setAttribute('fill', opts.fill);
      circle.setAttribute('stroke', opts.stroke);
      circle.setAttribute('r', opts.radius);
      circle.setAttribute('stroke-width', opts.strokeWidth);
      circle.setAttribute('stroke-linecap', 'round');

      return circle;
    },

    makeLabel: (params) => {
      const opts = Object.assign({
        text: '',
        x: 0,
        y: 0,
        color: '',
        fontFamily: 'sans-serif',
        fontSize: '7px',
      }, params);

      const label = ElementFactory.createSVGElement('text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-family', opts.fontFamily);
      label.setAttribute('font-size', opts.fontSize);
      label.setAttribute('fill', opts.color);
      label.setAttribute('x', opts.x);
      label.setAttribute('y', opts.y);
      label.textContent = opts.text;

      return label;
    },

    makePolygon: (points = [], params) => {
      const opts = Object.assign({
        fill: '#000',
        stroke: '#000',
        strokeWidth: '1px',
      }, params);

      const polygon = ElementFactory.createSVGElement('polygon');
      polygon.setAttribute('stroke-linecap', 'round');
      polygon.setAttribute('points', points);
      polygon.setAttribute('fill', opts.fill);
      polygon.setAttribute('stroke', opts.stroke);
      polygon.setAttribute('stroke-width', opts.strokeWidth);

      return polygon;
    },

    getSVG: (radius = 0) => {
      const diameter = parseFloat(radius) * 2;

      const svg = ElementFactory.createSVGElement('svg', 'polygonchart');
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('polygonchart', '');
      svg.setAttribute('height', `${diameter}px`);
      svg.setAttribute('width', `${diameter}px`);
      svg.setAttribute('viewBox', `0 0 ${diameter} ${diameter}`);

      return svg;
    },

    createSVGElement: (type, name) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', type);
      if (name) {
        el.setAttribute('data-name', name);
      }
      return el;
    },
  };

  //

  const defaultOptions = {
    target: null,
    radius: 0,
    data: {
      data: [],
      sides: 0,
      tooltips: {
        roundTo: 0,
        percentage: false,
      },
      colors: {
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
      },
    },
    polygon: {
      colors: {
        normal: {
          fill: '#fff',
          stroke: '#8c8c8c',
        },
        onHover: {
          splineFill: '#fff',
          splineStroke: '#000',
        },
      },
    },
    levels: {
      count: 5,
      labels: {
        enabled: true,
        position: {
          spline: 1,
          quadrant: 0,
        },
        colors: {
          normal: '#8c8c8c',
          onHover: '#000',
        },
      },
    },
    tippy: {},
    anime: {
      duration: 1000,
      easing: 'linear',
    },
    animation: {
      autoplay: false,
    },
  };

  scope.options = Object.assign(defaultOptions, options);

  scope.svg = null;
  scope.animations = [];

  let splineGroup;
  let labelGroup;
  let dataPoly;

  let dataPoints = [];
  let dataFinalPointValues = [];
  let dataFinalValues = [];

  let isFourth = 0;
  let isEven = 0;
  let offset = -1;
  let outerRadius = -1;
  let innerRadius = -1;
  let period = -1;
  let usingQuadrantPositioning = -1;

  //

  const events = {
    onEnterDataPoint: (elem) => {
      elem.setAttribute('fill', scope.options.data.colors.onHover.pointFill);
      elem.setAttribute('stroke', scope.options.data.colors.onHover.pointStroke);
    },
    onLeaveDataPoint: (elem) => {
      elem.setAttribute('fill', scope.options.data.colors.normal.pointFill);
      elem.setAttribute('stroke', scope.options.data.colors.normal.pointStroke);
    },

    onEnterSpline: (elem) => {
      elem.setAttribute('fill', scope.options.polygon.colors.onHover.fill);
      elem.setAttribute('stroke', scope.options.polygon.colors.onHover.stroke);

      const i = elem.getAttribute('index');
      const text = labelGroup.querySelector(`text[index='${i}']`);
      if (text) {
        text.setAttribute('fill', scope.options.levels.labels.colors.onHover);
      }
    },
    onLeaveSpline: (elem) => {
      elem.setAttribute('fill', scope.options.polygon.colors.normal.fill);
      elem.setAttribute('stroke', scope.options.polygon.colors.normal.stroke);

      const i = elem.getAttribute('index');
      const text = labelGroup.querySelector(`text[index='${i}']`);
      if (text) {
        text.setAttribute('fill', scope.options.levels.labels.colors.normal);
      }
    },

    onEnterDataPoly: (elem) => {
      elem.setAttribute('fill', scope.options.data.colors.onHover.polygonFill);
      elem.setAttribute('stroke', scope.options.data.colors.onHover.polygonStroke);
    },
    onLeaveDataPoly: (elem) => {
      elem.setAttribute('fill', scope.options.data.colors.normal.polygonFill);
      elem.setAttribute('stroke', scope.options.data.colors.normal.polygonStroke);
    },
  };

  //

  const appendData = () => {
    const dataGroup = ElementFactory.createSVGElement('g', 'data');
    const dataPointGroup = ElementFactory.createSVGElement('g', 'data-points');

    for (let j = 1; j <= scope.options.data.sides; j++) {
      const dataPointItem = ElementFactory.createSVGElement('g', `point-${j}`);
      const dataPoint = ElementFactory.makeCircle({
        radius: 10,
      });
      const dataPointInner = ElementFactory.makeCircle({
        fill: scope.options.data.colors.normal.pointFill,
        stroke: scope.options.data.colors.normal.pointStroke,
        radius: 4,
        strokeWidth: '2px',
      });
      dataPointItem.appendChild(dataPoint);
      dataPointItem.appendChild(dataPointInner);
      dataPointGroup.appendChild(dataPointItem);

      dataPointItem.addEventListener('mouseenter', events.onEnterDataPoint.bind(this, dataPointInner));
      dataPointItem.addEventListener('touchstart', events.onEnterDataPoint.bind(this, dataPointInner));
      dataPointItem.addEventListener('mouseleave', events.onLeaveDataPoint.bind(this, dataPointInner));
      dataPointItem.addEventListener('touchend', events.onLeaveDataPoint.bind(this, dataPointInner));
      dataPointItem.style.setProperty('cursor', 'pointer');

      dataPoints.push(dataPointItem);
    }

    dataGroup.appendChild(dataPoly);

    scope.svg.appendChild(dataGroup);
    scope.svg.appendChild(dataPointGroup);
  };

  const getAllData = () => {
    const { radius } = scope.options;

    for (let m = 0; m < scope.options.data.data.length; m++) {
      let points = '';

      for (let side = 1, k = 0; side <= scope.options.data.sides; side++ , k++) {
        const nextAngle = toRad((period * side) - offset);
        const ex = (radius * scope.options.data.data[m][k]) * Math.cos(nextAngle) + radius;
        const ey = (radius * scope.options.data.data[m][k]) * Math.sin(nextAngle) + radius;

        // + appended space
        points += `${ex},${ey} `;

        if (!Array.isArray(dataFinalPointValues[k])) dataFinalPointValues[k] = [];
        dataFinalPointValues[k].push({ x: ex, y: ey });
      }

      dataFinalValues.push(points);
    }
  };

  const setData = (index = -1) => {
    const { radius } = scope.options;

    let points = '';
    for (let side = 1, k = 0; side <= scope.options.data.sides; side++ , k++) {
      const nextAngle = toRad((period * side) - offset);

      const ex = (radius * scope.options.data.data[index][k]) * Math.cos(nextAngle) + radius;
      const ey = (radius * scope.options.data.data[index][k]) * Math.sin(nextAngle) + radius;

      // + appended space
      points += `${ex},${ey} `;

      let pointValue = scope.options.data.data[index][k];
      if (scope.options.data.tooltips.percentage) {
        pointValue *= 100;
      }
      if (scope.options.data.tooltips.roundTo) {
        pointValue = pointValue.toFixed(scope.options.data.tooltips.roundTo);
      }
      const tippyContent = `${pointValue}${(scope.options.data.tooltips.percentage ? '%' : '')}`;

      dataPoints[k].style.setProperty('transform', `translateX(${ex}px) translateY(${ey}px)`);
      dataPoints[k].setAttribute('data-value', pointValue);
      dataPoints[k].setAttribute('data-tippy-content', tippyContent);
    }

    dataPoly.setAttribute('points', points);
  };

  const drawSplines = (data = {}) => {
    const { radius, levels } = data;

    let crosshairGroup;
    if (levels === scope.options.levels.count) crosshairGroup = ElementFactory.createSVGElement('g', 'crosshairs');

    let points = '';
    let fe = -1;

    const buffer = scope.options.radius / scope.options.levels.count * Math.cos(toRad((period * 1) - offset));

    for (let side = 1; side <= scope.options.data.sides; side++) {
      const nextAngle = toRad((period * side) - offset);

      const ex = radius * Math.cos(nextAngle) + scope.options.radius;
      const ey = radius * Math.sin(nextAngle) + scope.options.radius;

      if (side === scope.options.data.sides && isEven) {
        fe = ex;
      } else if (side === 2 && !isEven) {
        fe = ex;
      }

      points += `${ex},${ey} `; /* + appended space */

      if (levels === scope.options.levels.count) {
        const innerX = innerRadius * Math.cos(nextAngle) + scope.options.radius;
        const innerY = innerRadius * Math.sin(nextAngle) + scope.options.radius;

        const outerX = outerRadius * Math.cos(nextAngle) + scope.options.radius;
        const outerY = outerRadius * Math.sin(nextAngle) + scope.options.radius;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', scope.options.polygon.colors.normal.stroke);
        line.setAttribute('x1', innerX);
        line.setAttribute('y1', innerY);
        line.setAttribute('x2', outerX);
        line.setAttribute('y2', outerY);

        if (crosshairGroup) crosshairGroup.appendChild(line);
      }
    }

    const pointValue = (100 / scope.options.levels.count) * levels;
    const text = `${pointValue}%`;

    let labelX = `${scope.options.radius}px`;
    const delta = isEven ? 0 : buffer;
    const labelY = `${fe + delta}px`;
    const subY = (text.length - 1) * 6;

    const label = ElementFactory.makeLabel({
      text,
      x: labelX,
      y: labelY,
      color: scope.options.levels.labels.colors.normal,
    });
    label.setAttribute('index', levels);

    if (usingQuadrantPositioning) {
      const shouldFlip = scope.options.levels.labels.position.quadrant % scope.options.data.sides >= Math.floor(scope.options.data.sides / 2);

      let rotateY = `${fe + subY}px`;
      let divider = 0;

      if (shouldFlip) {
        divider = 180;
        rotateY = labelY;
      }

      label.style.setProperty('transform-origin', `${labelX} ${rotateY}`);
      label.style.setProperty('transform', `rotateZ(${divider}deg)`);
    } else {
      let gt = scope.options.data.sides / 2;
      if (isEven) gt = Math.floor(gt);
      const shouldFlip = scope.options.levels.labels.position.spline % scope.options.data.sides >= gt;

      let rotateY = `${fe - 2 + subY}px`;
      let divider = 180 / scope.options.data.sides;
      if (shouldFlip) {
        divider += 180;
        labelX = `${scope.options.radius - 7}px`;
        rotateY = labelY;
      }

      label.style.setProperty('transform-origin', `${labelX} ${rotateY}`);
      label.style.setProperty('transform', `rotateZ(${-divider}deg)`);
    }

    if (levels !== 0) {
      labelGroup.appendChild(label);
    }

    const poly = ElementFactory.makePolygon(points, {
      stroke: scope.options.polygon.colors.normal.stroke,
      fill: scope.options.polygon.colors.normal.fill,
    });
    poly.setAttribute('index', levels);
    poly.addEventListener('mouseenter', events.onEnterSpline.bind(this, poly));
    poly.addEventListener('touchstart', events.onEnterSpline.bind(this, poly));
    poly.addEventListener('mouseleave', events.onLeaveSpline.bind(this, poly));
    poly.addEventListener('touchend', events.onLeaveSpline.bind(this, poly));
    splineGroup.appendChild(poly);

    // additional inner polygon ...
    if (levels > 0) {
      const newRadius = radius - (scope.options.radius / scope.options.levels.count);
      const newLevels = levels - 1 >= 0 ? levels - 1 : 0;
      drawSplines({
        radius: newRadius,
        levels: newLevels,
      });
    }

    scope.svg.appendChild(splineGroup);
    if (levels === scope.options.levels.count) scope.svg.appendChild(crosshairGroup);
    scope.svg.appendChild(labelGroup);
  };

  const setLabels = () => {
    const divider = 180 / scope.options.data.sides;
    let rotate = 0;

    if (usingQuadrantPositioning) {
      // e.g. 5-sided polygon: 1/36 - 2/108 - 3/180 - 4/252 - 5/324
      rotate = divider + (divider * 2 * (scope.options.levels.labels.position.quadrant - 1));
    } else {
      // e.g. 5-sided polygon:  1/0 - 2/72 - 3/144 - 4/216 - 5/288
      rotate = (divider * 2) * scope.options.levels.labels.position.spline;
    }

    if ((!isEven || isFourth) && scope.options.data.sides > 3) rotate += divider;

    labelGroup.style.setProperty('transform-origin', `${scope.options.radius}px ${scope.options.radius}px`);
    labelGroup.style.setProperty('transform', `rotateZ(${rotate}deg)`);
  };

  const setup = () => {
    const existing = scope.options.target.querySelector('[polygonchart]');
    if (existing) {
      existing.remove();
    }

    dataPoints = [];
    dataFinalPointValues = [];
    dataFinalValues = [];

    splineGroup = ElementFactory.createSVGElement('g', 'splines');
    labelGroup = ElementFactory.createSVGElement('g', 'labels');

    scope.svg = ElementFactory.getSVG(scope.options.radius);

    dataPoly = ElementFactory.makePolygon('', {
      fill: scope.options.data.colors.normal.polygonFill,
      stroke: scope.options.data.colors.normal.polygonStroke,
    });
    dataPoly.addEventListener('mouseenter', events.onEnterDataPoly.bind(this, dataPoly));
    dataPoly.addEventListener('touchstart', events.onEnterDataPoly.bind(this, dataPoly));
    dataPoly.addEventListener('mouseleave', events.onLeaveDataPoly.bind(this, dataPoly));
    dataPoly.addEventListener('touchend', events.onLeaveDataPoly.bind(this, dataPoly));

    // set initial rotation angle of polygon
    isEven = (scope.options.data.sides % 2 === 0);
    isFourth = (scope.options.data.sides % 4 === 0);
    offset = isEven ? (360 / (scope.options.data.sides * 2)) : 90;
    usingQuadrantPositioning = scope.options.levels.labels.position.quadrant !== 0;

    outerRadius = scope.options.radius;
    innerRadius = scope.options.radius / scope.options.levels.count;
    period = 360 / scope.options.data.sides;

    scope.options.target.appendChild(scope.svg);
  };

  const loadAnimations = () => {
    const anime = window.anime || null;
    if (typeof anime === 'undefined' || anime === null) {
      return;
    }

    const dataPolyAnimation = anime({
      ...scope.options.anime,
      targets: dataPoly,
      autoplay: false,
      points: dataFinalValues.map((value) => ({ value })),
    });

    scope.animations.push(dataPolyAnimation);

    for (let i = 0; i < dataPoints.length; i++) {
      const point = dataPoints[i];
      const arr = dataFinalPointValues[i];

      if (arr) {
        const dataPolyPointAnimation = anime({
          ...scope.options.anime,
          targets: point,
          autoplay: false,
          translateX: arr.map(({ x }) => ({ value: x })),
          translateY: arr.map(({ y }) => ({ value: y })),
        });

        scope.animations.push(dataPolyPointAnimation);
      }
    }

    if (scope.options.animation.autoplay) scope.start();
  };

  //

  scope.init = () => {
    setup();

    drawSplines({ levels: scope.options.levels.count, radius: scope.options.radius });
    appendData();
    setData(0);
    getAllData();
    setLabels();
    loadAnimations();

    const tippy = window.tippy || null;
    if (typeof tippy === 'undefined' || tippy === null) {
      return scope;
    }

    tippy('[data-tippy-content]', scope.options.tippy);

    return scope;
  };

  scope.startAnimation = () => {
    const { animations } = scope;

    for (let i = 0; i < animations.length; i++) {
      animations[i].play();
    }

    return scope;
  };

  scope.resetAnimation = () => {
    const { animations } = scope;

    for (let i = 0; i < animations.length; i++) {
      const a = animations[i];
      a.restart();
      a.pause();
    }

    return scope;
  };

  scope.stopAnimation = () => {
    const { animations } = scope;

    for (let i = 0; i < animations.length; i++) {
      animations[i].pause();
    }

    return scope;
  };

  scope.seekAnimation = (val = 0) => {
    const { animations } = scope;

    for (let i = 0; i < animations.length; i++) {
      animations[i].seek(val);
    }

    return scope;
  };

  scope.reload = () => {
    scope.init();

    return scope;
  };

  return scope;
}

export default PolygonChart;
