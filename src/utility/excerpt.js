const excerpt = (text, length = 500) => {
  if (text.length <= length) return text;
  const suffix = '...';
  const str = text.slice(0, length - suffix.length);
  let last = str.length - 1;
  while (last > 0 && /[a-z0-9]/i.test(str[last]) === false) last--;
  last = last || length - suffix.length;
  return str.slice(0, last) + suffix;
};

module.exports = excerpt;
