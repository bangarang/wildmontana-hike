const config = require('../../config');
const marked = require('marked');

const renderer = new marked.Renderer();

// Make hyperlinks with absolute URLs open in a new tab.
renderer.link = (href, title, text) => {
  if (/^http(s?):\/\//.test(href)) {
    return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
  }
  return `<a href="${href}">${text}</a>`;
};

// Render images as HTML5 figures.
renderer.image = (href, title, text) => {
  if (config.pattern.image.test(href)) {
    href = href.split('#')[0].replace('http:', 'https:');
    if (href.startsWith('https://cdn.elebase.io')) {
      const params = [];
      if (!href.includes('q=')) params.push('q=75');
      if (!href.includes('rot=')) params.push('rot=auto');
      href = href + (!href.includes('?') ? '?' : '&') + params.join('&');
    }
  }
  text = text ? text.trim() : (title ? title.trim() : '');
  const image = `<img src="${href}" alt="${text}" title="${text}">`;
  const caption = text ? `<figcaption>${text}</figcaption>` : '';
  return `<figure>${image}${caption}</figure>`;
};

marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
  renderer,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  tables: true
});

module.exports = marked;
