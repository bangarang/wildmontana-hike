const slug = (text, encode = false) => {
  text = text
    .toString()
    .toLowerCase()
    .replace(/[\s_]/g, '-')
    .replace(/[^\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\w\-]/g, '')
    .replace(/[·]/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  return encode && text ? encodeURIComponent(text) : text || 'entry';
};

module.exports = slug;
