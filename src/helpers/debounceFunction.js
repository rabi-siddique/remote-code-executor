export default function debounceFunction(fn, delay, args = []) {
  let timer;
  return function () {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, [...args]);
    }, delay);
  };
}
