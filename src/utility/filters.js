const excerpt = require('./excerpt');
const md = require('./markdown');

// Extract the host portion of a URL string.
const host = url => {
  const h = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const parts = h.split('.').slice(-3);
  if (parts[0] === 'www') parts.shift();
  return parts.join('.');
};

// Convert a string from Markdown to HTML.
const markdown = text => md(text);

// Encode data as a JSON string value.
const json = data => {
  let str = '';
  try {
    str = JSON.stringify(data, undefined, 2);
  } catch (err) {
    console.error(err);
  }
  return str;
};

module.exports = { excerpt, host, json, markdown };
