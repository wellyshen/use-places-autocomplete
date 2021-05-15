export default <F extends (...args: any[]) => void>(
  fn: F,
  delay: number
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null;

  // eslint-disable-next-line func-names
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};
