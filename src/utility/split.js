const split = (array, size) => {
  if (!Array.isArray(array) || !array.length) return [];
  const length = parseInt(size);
  if (Number.isNaN(length) || length < 1) return array;
  const arrays = [];
  for (let i = 0; i < array.length; i += length) {
    arrays.push(array.slice(i, i + length));
  }
  return arrays;
};

module.exports = split;
