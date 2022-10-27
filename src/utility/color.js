const color = {
  rgba(hex, alpha = 1) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const num = parseInt(hex, 16);
    return [num >> 16, num >> 8 & 255, num & 255, alpha];
  }
};

module.exports = color;
