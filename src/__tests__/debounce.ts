import debounce from "../debounce";

describe("debounce", () => {
  it("should trigger function immediately", () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);
    debouncedFn();
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalled();
  });
});
