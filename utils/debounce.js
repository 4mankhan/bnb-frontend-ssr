export default function debounce(fn, delay) {
  let timer;

  function debounced(...args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timer);
  };

  return debounced;
}