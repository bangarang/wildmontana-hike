const config = require('../../config');
const query = require('../utility/query');

const arrayElements = ['contact', 'entry', 'datetime', 'embed', 'file', 'option'];
const stringElements = ['id', 'text'];

const directionsURL = 'https://maps.google.com?saddr=Current+Location';
const types = Object.entries(config.id.type).filter((k, v) => typeof v != 'string');

const format = {
  caption(obj) {
    let caption = '';

    if (obj.description || obj.ip_attribution) {
      caption = (obj.description || '').trim();
      caption += obj.ip_attribution ? (caption ? ' – ' : '') : '';
      caption += (obj.ip_attribution || '').trim();
    }

    return caption;
  },
  contact(obj) {
    const name = `${obj.name.first || ''} ${obj.name.last || ''}`.trim();
    const label = name || obj.organization || '';

    return {
      id: obj.id,
      email: obj.email || '',
      groups: Array.isArray(obj.groups) ? obj.groups.map(format.group) : [],
      label,
      locations: Array.isArray(obj.locations) ? obj.locations.map(format.location) : [],
      name,
      organization: obj.organization || '',
      phones: Array.isArray(obj.phones) ? obj.phones.map(format.phone) : [],
      url: obj.url || ''
    };
  },
  date(val, type) {
    switch (type) {
      case 'date/time':
        return (new Date(val)).toLocaleDateString('en-US', {
          year: '2-digit',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        });
      case 'date':
        const [y, m, d] = val.split('-');
        return [m, d, y].join('/');
      case 'time':
        const date = new Date();
        date.setHours(...val.split(':'));
        return date.toLocaleTimeString();
      default: return '';
    }
  },
  dates(dates, type) {
    const values = dates.map(date => format.date(date, type));
    if (values.length === 2 && values[0] === values[1]) values.pop();
    return values.length === 2 ? values.join(' – ') : values[0];
  },
  element(obj) {
    obj.groups = obj.groups || {};

    const el = {
      id: obj.id,
      groups: Array.isArray(obj.groups.element) ? obj.groups.element.map(format.group) : [],
      name: obj.name.trim(),
      options: Array.isArray(obj.options) ? obj.options : [],
      preferences: obj.preferences || {},
      type: obj.type
    };

    if (obj.data !== undefined) {
      el.data = obj.data;
    }

    if (Array.isArray(el.data)) {
      if (el.type === 'contact') {
        el.data = el.data.map(format.contact);
      } else if (el.type === 'embed') {
        el.data = el.data.map(format.embed);
      } else if (el.type === 'file') {
        el.data = el.data.map(format.file);
      }
    }

    if (el.type === 'geo' && el.data) {
      el.data = format.geo.data(el.data);
    }

    return el;
  },
  embed(obj) {
    return {
      id: obj.id,
      caption: format.caption(obj),
      locale: obj.locale || null,
      oembed: obj.oembed || null,
      title: (obj.title || '').trim(),
      url: obj.url
    };
  },
  entry(obj) {
    const en = {
      dates: '',
      elements: Array.isArray(obj.elements) ? obj.elements.map(format.element) : [],
      featured: false,
      groups: Array.isArray(obj.groups) ? obj.groups.map(format.group) : [],
      image: null,
      subtitle: '',
      summary: '',
      type: 'entry',
      types: Array.isArray(obj.types) ? obj.types.map(format.type) : [],
      walk: { dates: [], url: '' }
    };

    en.featured = en.groups.some(id => id === config.id.group.entry.featured);
    en.subtitle = en.types.map(t => t.name).sort().join(', ');
    en.type = classify(en);

    for (const el of en.elements) {
      if (el.type === 'boolean' || el.data === null) continue;
      if (stringElements.includes(el.type) && (typeof el.data != 'string' || !el.data)) continue;
      if (arrayElements.includes(el.type) && (!Array.isArray(el.data) || !el.data.length)) continue;

      switch (el.id) {
        case config.id.element.datetime.report:
          const rdt = el.preferences.data_type || 'date/time';
          en.dates = el.data.map(dates => format.dates(dates, rdt)).shift();
          if (en.dates && en.type === 'report') {
            en.subtitle = en.dates;
          }
          break;
        case config.id.element.file.image:
          en.image = format.file(el.data[0]);
          break;
        case config.id.element.text.summary:
          en.summary = el.data.trim();
          break;
        case config.id.element.text.url.walk:
          en.walk.url = el.data.trim();
          break;
        case config.id.element.datetime.walk:
          const wdt = el.preferences.data_type || 'date/time';
          const expired = !el.data.some(dates => new Date(dates[0]) >= new Date());
          en.walk.dates = !expired ? el.data.map(dates => format.dates(dates, wdt)) : [];
          break;
      }
    }

    if (!en.image && en.type in config.url.image.placeholder) {
      en.image = { url: config.url.image.placeholder[en.type] };
    }

    return { ...obj, ...en };
  },
  sponsor(obj) {
      const sponsor = {
        logo: null,
        description: '',
        title: obj.title,
        id: obj.id,
        link: ''
      };
      const {description, link, logo} = config.id.group.sponsor;
      for (const el of obj.elements) {
          if(el.id === link) {
            sponsor.link = el.data;
          }
          if(el.id === logo) {
            sponsor.logo = format.file(el.data[0]);
          }
          if(el.id === description) {
            sponsor.description = el.data;
          }
      }
      return sponsor;
  },
  file(obj) {
    return {
      id: obj.id,
      caption: format.caption(obj),
      locale: obj.locale || null,
      name: obj.name,
      title: (obj.title || '').trim(),
      type: obj.type,
      url: obj.url
    };
  },
  geo: {
    data(geo) {
      return {
        id: geo.id,
        point: geo.point,
        zoom: geo.zoom,
        features: (geo.features || []).map(format.geo.feature)
      };
    },
    feature(f) {
      return {
        id: f.id,
        type: {
          id: f.type.id,
          type: f.type.type,
          color: f.type.color,
          name: f.type.name,
          attributes: f.type.attributes
        },
        json: f.json,
        geometry: JSON.parse(f.json)
      };
    }
  },
  group(val) {
    if (typeof val == 'string') return val;
    return typeof val == 'object' && val && val.id ? val.id : '';
  },
  location(obj) {
    const lc = {
      address: [],
      name: (obj.name || '').trim(),
      url: ''
    };

    if (obj.detail) {
      lc.address.push(obj.detail);
    }

    if (obj.city || obj.postcode) {
      let line = obj.city || '';
      if (obj.division && (obj.division.code || obj.division.text)) {
        const { code, text } = obj.division;
        line = (line ? `${line}, ${code || text}` : code || text).trim();
      }
      if (obj.postcode) {
        line += ` ${obj.postcode}`;
      }
      lc.address.push(line);
    }

    if (obj.point) {
      const [lon, lat] = obj.point.split(',').map(s => s.trim());
      if (lon && lat) {
        lc.url = `${directionsURL}&daddr=${`${lat},${lon}`}`;
      }
    }

    if (!lc.url && lc.address.length) {
      const addr = lc.address.map(ln => ln.split(' ').map(w => query(w)).join('+')).join('+');
      const box = addr.toLowerCase().replace('.', '').startsWith('po+box');
      if (!box) lc.url = `${directionsURL}&daddr=${addr}`;
    }

    return lc;
  },
  phone(obj) {
    return {
      id: obj.id,
      country: obj.country || '',
      extension: (obj.extension || '').trim(),
      name: (obj.name || '').trim(),
      number: obj.number || { text: '' }
    };
  },
  type(obj) {
    const type = {
      id: obj.id,
      groups: [],
      name: obj.name.trim()
    };

    if (obj.groups && Array.isArray(obj.groups.type)) {
      type.groups = obj.groups.type.map(format.group);
    }

    return type;
  },
  user(obj) {
    return {
      id: obj.id,
      email: obj.email,
      name: obj.name,
      organization: obj.organization || '',
      point: obj.point || ''
    };
  }
};

const classify = en => {
  for (const t of en.types) {
    for (const [key, id] of types) {
      if (t.id === id) {
        return key;
      }
    }
  }
  return 'entry';
};

module.exports = format;
