import { renderHook } from '@testing-library/react-hooks';
import _debounce from 'lodash.debounce';

import usePlacesAutocomplete, {
  HookArgs,
  loadApiErr,
} from '../usePlacesAutocomplete';

jest.mock('lodash.debounce');
// @ts-ignore
_debounce.mockImplementation((fn) => fn);

describe('usePlacesAutocomplete', () => {
  jest.useFakeTimers();
  global.console.error = jest.fn();

  const callbackName = 'initMap';
  const testHook = (args: HookArgs = {}): any =>
    renderHook(() => usePlacesAutocomplete(args));

  const val = 'usePlacesAutocomplete so Cool 😎';
  const ok = 'OK';
  const error = 'ERROR';
  const data = [{ place_id: '0109' }];
  const okSuggestions = {
    loading: false,
    status: ok,
    data,
  };
  const defaultSuggestions = {
    loading: false,
    status: '',
    // @ts-ignore
    data: [],
  };
  const getPlacePredictions = jest.fn();
  const getMaps = (type = 'success'): object => ({
    maps: {
      places: {
        AutocompleteService: class {
          getPlacePredictions =
            type === 'opts'
              ? getPlacePredictions
              : (
                  _: object,
                  cb: (data: object[] | null, status: string) => void
                ): void => {
                  setTimeout(() => {
                    cb(
                      type === 'success' ? data : null,
                      type === 'success' ? ok : error
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
    // @ts-ignore
    global.console.error.mockClear();
  });

  it('should set "callbackName" correctly', () => {
    testHook({ callbackName });
    expect((window as any)[callbackName]).toBeUndefined();

    // @ts-ignore
    delete global.google;
    renderHook(() =>
      // @ts-ignore
      usePlacesAutocomplete({ callbackName, googleMaps: getMaps().maps })
    );
    expect((window as any)[callbackName]).toBeUndefined();

    testHook({ callbackName });
    expect((window as any)[callbackName]).toEqual(expect.any(Function));
  });

  it('should delete "callbackName" when un-mount', () => {
    const { unmount } = testHook({ callbackName });
    unmount();
    expect((window as any)[callbackName]).toBeUndefined();
  });

  it('should throw error when no Places API', () => {
    // @ts-ignore
    delete global.google.maps.places;
    testHook();

    // @ts-ignore
    delete global.google.maps;
    testHook();

    // @ts-ignore
    delete global.google;
    testHook();

    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenCalledWith(loadApiErr);
  });

  it('should set debounce correctly', () => {
    testHook();
    expect(_debounce).toHaveBeenCalledWith(expect.any(Function), 200);

    const debounce = 500;
    renderHook(() => usePlacesAutocomplete({ debounce }));
    expect(_debounce).toHaveBeenCalledWith(expect.any(Function), debounce);
  });

  it('should set "requestOptions" correctly', () => {
    // @ts-ignore
    global.google = getMaps('opts');
    const opts = { radius: 100 };
    const { result } = testHook({ requestOptions: opts });
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
    let res = testHook({ googleMaps: getMaps().maps }).result;
    expect(res.current.ready).toBeTruthy();

    res = testHook().result;
    expect(res.current.ready).toBeFalsy();

    // @ts-ignore
    global.google = getMaps();
    res = testHook().result;
    expect(res.current.ready).toBeTruthy();
  });

  it('should return "value" correctly', () => {
    const { result } = testHook();
    expect(result.current.value).toBe('');

    result.current.setValue(val);
    expect(result.current.value).toBe(val);
  });

  it('should return "suggestions" correctly', () => {
    let res = testHook().result;
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue('');
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
    global.google = getMaps('failure');
    res = testHook().result;
    res.current.setValue(val);
    jest.runAllTimers();
    expect(res.current.suggestions).toEqual({
      loading: false,
      status: error,
      data: [],
    });
  });

  it('should clear suggestions', () => {
    const { result } = testHook();
    result.current.setValue(val);
    jest.runAllTimers();
    expect(result.current.suggestions).toEqual(okSuggestions);

    result.current.clearSuggestions();
    expect(result.current.suggestions).toEqual(defaultSuggestions);
  });
});
