const callbacks = [];
let firing = false;

const fire = () => {
  callbacks.forEach(cb => cb());
  firing = false;
};

const handle = () => {
  if (!firing) {
    firing = true;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(fire);
    } else {
      setTimeout(fire, 66);
    }
  }
};

export default {
  watch(cb) {
    if (!callbacks.length) {
      window.addEventListener('resize', handle);
    }
    callbacks.push(cb);
  },
  unwatch(cb) {
    const idx = callbacks.findIndex(fn => fn === cb);
    if (idx !== -1) {
      callbacks.splice(idx, 1);
    }
    if (!callbacks.length) {
      window.removeEventListener('resize', handle);
    }
  }
};

