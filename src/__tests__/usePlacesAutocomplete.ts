import { renderHook, act } from "@testing-library/react-hooks";

import usePlacesAutocomplete, {
  HookArgs,
  loadApiErr,
} from "../usePlacesAutocomplete";
import _debounce from "../debounce";

jest.mock("../debounce");
// @ts-expect-error
_debounce.mockImplementation((fn) => fn);

describe("usePlacesAutocomplete", () => {
  jest.useFakeTimers("modern");

  const callbackName = "initMap";
  const renderHelper = (args: HookArgs = {}) =>
    renderHook(() => usePlacesAutocomplete({ cache: false, ...args })).result;

  const ok = "OK";
  const error = "ERROR";
  const data = [{ place_id: "0109" }];
  const okSuggestions = {
    loading: false,
    status: ok,
    data,
  };
  const defaultSuggestions = {
    loading: false,
    status: "",
    data: [],
  };
  const getPlacePredictions = jest.fn();
  const getMaps = (type = "success", d = data): any => ({
    maps: {
      places: {
        AutocompleteService: class {
          getPlacePredictions =
            type === "opts"
              ? getPlacePredictions
              : (_: any, cb: (dataArg: any, status: string) => void) => {
                  setTimeout(() => {
                    cb(
                      type === "success" ? d : null,
                      type === "success" ? ok : error
                    );
                  }, 500);
                };
        },
      },
    },
  });

  beforeEach(() => {
    global.google = getMaps();
    getPlacePredictions.mockClear();
    // @ts-expect-error
    _debounce.mockClear();
  });

  it('should set "callbackName" correctly', () => {
    renderHelper({ callbackName });
    expect((window as any)[callbackName]).toBeUndefined();

    // @ts-ignore
    delete global.google.maps;
    renderHelper({ callbackName, googleMaps: getMaps().maps });
    expect((window as any)[callbackName]).toBeUndefined();

    // @ts-ignore
    delete global.google;
    renderHelper({ callbackName, googleMaps: getMaps().maps });
    expect((window as any)[callbackName]).toBeUndefined();

    renderHelper({ callbackName });
    expect((window as any)[callbackName]).toEqual(expect.any(Function));
  });

  it('should delete "callbackName" when un-mount', () => {
    renderHelper({ callbackName });
    expect((window as any)[callbackName]).toBeUndefined();
  });

  it("should throw error when no Places API", () => {
    console.error = jest.fn();

    // @ts-ignore
    delete global.google.maps.places;
    renderHelper();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(loadApiErr);

    // @ts-ignore
    delete global.google.maps;
    renderHelper();
    expect(console.error).toHaveBeenCalledTimes(2);

    // @ts-ignore
    delete global.google;
    renderHelper();
    expect(console.error).toHaveBeenCalledTimes(3);

    const result = renderHelper({ initOnMount: false });
    expect(console.error).toHaveBeenCalledTimes(3);
    result.current.init();
    expect(console.error).toHaveBeenCalledTimes(4);
  });

  it("should set debounce correctly", () => {
    renderHelper();
    expect(_debounce).toHaveBeenCalledWith(expect.any(Function), 200);

    const debounce = 500;
    renderHelper({ debounce });
    expect(_debounce).toHaveBeenCalledWith(expect.any(Function), debounce);
  });

  it('should set "requestOptions" correctly', () => {
    global.google = getMaps("opts");
    const opts = { radius: 100 };
    const result = renderHelper({ requestOptions: opts });
    act(() => result.current.setValue("test"));
    expect(getPlacePredictions).toHaveBeenCalledWith(
      { ...opts, input: "test" },
      expect.any(Function)
    );
  });

  it('should return "ready" correctly', () => {
    console.error = () => null;

    // @ts-ignore
    delete global.google;
    let res = renderHelper({ googleMaps: getMaps().maps });
    expect(res.current.ready).toBeTruthy();

    res = renderHelper();
    expect(res.current.ready).toBeFalsy();

    global.google = getMaps();
    res = renderHelper();
    expect(res.current.ready).toBeTruthy();
  });

  it('should return "value" correctly', () => {
    let result = renderHelper();
    expect(result.current.value).toBe("");

    const defaultValue = "Welly";
    result = renderHelper({ defaultValue });
    expect(result.current.value).toBe(defaultValue);

    act(() => {
      result.current.setValue("test");
      jest.runAllTimers();
    });
    expect(result.current.value).toBe("test");
  });

  it('should return "suggestions" correctly', () => {
    let res = renderHelper();
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    act(() => res.current.setValue(""));
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    act(() => res.current.setValue("test", false));
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    act(() => res.current.setValue("test"));
    expect(res.current.suggestions).toEqual({
      ...defaultSuggestions,
      loading: true,
    });

    act(() => {
      res.current.setValue("test");
      jest.runAllTimers();
    });
    expect(res.current.suggestions).toEqual(okSuggestions);

    global.google = getMaps("failure");
    res = renderHelper();
    act(() => {
      res.current.setValue("test");
      jest.runAllTimers();
    });
    expect(res.current.suggestions).toEqual({
      loading: false,
      status: error,
      data: [],
    });
  });

  it('should return "suggestions" with cache correctly', () => {
    let res = renderHelper({ cache: 0 });
    act(() => {
      res.current.setValue("prev");
      jest.runAllTimers();
    });
    expect(res.current.suggestions).toEqual(okSuggestions);

    jest.setSystemTime(0);
    const cachedData = [{ place_id: "1119" }];
    global.google = getMaps("success", cachedData);
    res = renderHelper({ cache: 10 });
    act(() => {
      res.current.setValue("prev");
      jest.runAllTimers();
    });
    expect(res.current.suggestions).toEqual({
      ...okSuggestions,
      data: cachedData,
    });

    global.google = getMaps();
    res = renderHelper({ cache: 10 });
    act(() => {
      res.current.setValue("prev");
      jest.runAllTimers();
    });
    expect(res.current.suggestions).toEqual({
      ...okSuggestions,
      data: cachedData,
    });

    jest.setSystemTime(100000);
    act(() => {
      res.current.setValue("next");
      jest.runAllTimers();
    });
    act(() => {
      res.current.setValue("prev");
      jest.runAllTimers();
    });
    expect(res.current.suggestions).toEqual(okSuggestions);
  });

  it("should clear suggestions", () => {
    const result = renderHelper();
    act(() => {
      result.current.setValue("test");
      jest.runAllTimers();
    });
    expect(result.current.suggestions).toEqual(okSuggestions);

    act(() => result.current.clearSuggestions());
    expect(result.current.suggestions).toEqual(defaultSuggestions);
  });

  it("should not fetch data if places API not ready", () => {
    console.error = jest.fn();

    // @ts-ignore
    delete global.google;
    const result = renderHelper();
    act(() => result.current.setValue("test"));
    expect(result.current.suggestions).toEqual(defaultSuggestions);
  });

  it("should lazily init places API", () => {
    console.error = jest.fn();

    const result = renderHelper({ initOnMount: false });
    act(() => result.current.setValue("test"));
    expect(result.current.suggestions).toEqual(defaultSuggestions);

    result.current.init();
    act(() => {
      result.current.setValue("test");
      jest.runAllTimers();
    });
    expect(result.current.suggestions).toEqual(okSuggestions);
  });
});
