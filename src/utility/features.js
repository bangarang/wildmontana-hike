const color = require('./color');
const config = require('../../config');

const alpha = {
  path: config.geo.path.opacity,
  polygon: config.geo.polygon.opacity
};

const features = (geo, props) => {
  if (!Array.isArray(geo.features)) return [];

  const state = props.selected === true ? 1 : 0;

  return geo.features.map(f => {
    const type = f.type || {};
    const hex = '#' + (type.color || '444');
    const { icon = 'circle-15' } = type.attributes || {};
    const data = { type: 'Feature', geometry: f.geometry, properties: {} };

    if (type.type === 'polygon') {
      data.properties['color-fill'] = `rgba(${color.rgba(hex, alpha.polygon[state]).join(',')})`;
      data.properties['color-path'] = `rgba(${color.rgba(hex, alpha.path[state]).join(',')})`;
    } else if (type.type === 'path') {
      data.properties.color = `rgba(${color.rgba(hex, alpha.path[state]).join(',')})`;
      data.properties.width = config.geo.path.width[state];
    } else {
      data.properties.scale = config.geo.point.scale[state];
      data.properties.symbol = icon;
      data.properties.opacity = config.geo.point.opacity[state];
    }

    data.properties = Object.assign(data.properties, props || {});

    return data;
  });
};

module.exports = features;
