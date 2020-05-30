import { renderHook } from "@testing-library/react-hooks";
import _debounce from "lodash.debounce";

import usePlacesAutocomplete, {
  HookArgs,
  HookReturn as Current,
  loadApiErr,
} from "../usePlacesAutocomplete";

jest.mock("lodash.debounce");
// @ts-ignore
_debounce.mockImplementation((fn) => fn);

describe("usePlacesAutocomplete", () => {
  jest.useFakeTimers();

  const callbackName = "initMap";
  const renderHelper = (args: HookArgs = {}): { current: Current } =>
    renderHook(() => usePlacesAutocomplete(args)).result;

  const val = "usePlacesAutocomplete so Cool 😎";
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
    // @ts-ignore
    data: [],
  };
  const getPlacePredictions = jest.fn();
  const getMaps = (type = "success"): any => ({
    maps: {
      places: {
        AutocompleteService: class {
          getPlacePredictions =
            type === "opts"
              ? getPlacePredictions
              : (_: any, cb: (data: any, status: string) => void): void => {
                  setTimeout(() => {
                    cb(
                      type === "success" ? data : null,
                      type === "success" ? ok : error
                    );
                  }, 500);
                };
        },
      },
    },
  });

  beforeEach(() => {
    // @ts-ignore
    global.google = getMaps();
  });

  afterEach(() => {
    // @ts-ignore
    _debounce.mockClear();
  });

  it('should set "callbackName" correctly', () => {
    renderHelper({ callbackName });
    expect((window as any)[callbackName]).toBeUndefined();

    // @ts-ignore
    delete global.google.maps;
    // @ts-ignore
    renderHelper({ callbackName, googleMaps: getMaps().maps });
    expect((window as any)[callbackName]).toBeUndefined();

    // @ts-ignore
    delete global.google;
    // @ts-ignore
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
    // @ts-ignore
    delete global.google.maps;
    renderHelper();
    // @ts-ignore
    delete global.google;
    renderHelper();

    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenCalledWith(loadApiErr);
  });

  it("should set debounce correctly", () => {
    renderHelper();
    expect(_debounce).toHaveBeenCalledWith(expect.any(Function), 200);

    const debounce = 500;
    renderHelper({ debounce });
    expect(_debounce).toHaveBeenCalledWith(expect.any(Function), debounce);
  });

  it('should set "requestOptions" correctly', () => {
    // @ts-ignore
    global.google = getMaps("opts");
    const opts = { radius: 100 };
    const result = renderHelper({ requestOptions: opts });
    result.current.setValue(val);
    expect(getPlacePredictions).toHaveBeenCalledWith(
      { ...opts, input: val },
      expect.any(Function)
    );
  });

  it('should return "ready" correctly', () => {
    // @ts-ignore
    delete global.google;
    // @ts-ignore
    let res = renderHelper({ googleMaps: getMaps().maps });
    expect(res.current.ready).toBeTruthy();

    res = renderHelper();
    expect(res.current.ready).toBeFalsy();

    // @ts-ignore
    global.google = getMaps();
    res = renderHelper();
    expect(res.current.ready).toBeTruthy();
  });

  it('should return "value" correctly', () => {
    const result = renderHelper();
    expect(result.current.value).toBe("");

    result.current.setValue(val);
    expect(result.current.value).toBe(val);
  });

  it('should return "suggestions" correctly', () => {
    let res = renderHelper();
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue("");
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue(val, false);
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue(val);
    expect(res.current.suggestions).toEqual({
      ...defaultSuggestions,
      loading: true,
    });

    res.current.setValue(val);
    jest.runAllTimers();
    expect(res.current.suggestions).toEqual(okSuggestions);

    // @ts-ignore
    global.google = getMaps("failure");
    res = renderHelper();
    res.current.setValue(val);
    jest.runAllTimers();
    expect(res.current.suggestions).toEqual({
      loading: false,
      status: error,
      data: [],
    });
  });

  it("should clear suggestions", () => {
    const result = renderHelper();
    result.current.setValue(val);
    jest.runAllTimers();
    expect(result.current.suggestions).toEqual(okSuggestions);

    result.current.clearSuggestions();
    expect(result.current.suggestions).toEqual(defaultSuggestions);
  });
});
