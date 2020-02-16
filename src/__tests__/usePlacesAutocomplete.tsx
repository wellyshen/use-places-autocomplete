import { renderHook } from '@testing-library/react-hooks';
import _debounce from 'lodash.debounce';

import usePlacesAutocomplete, { loadApiErr } from '../usePlacesAutocomplete';

jest.mock('lodash.debounce');
// @ts-ignore
_debounce.mockImplementation(fn => fn);

describe('usePlacesAutocomplete', () => {
  global.console.error = jest.fn();

  const val = 'usePlacesAutocomplete so Cool 😎';
  const ok = 'OK';
  const error = 'ERROR';
  const data = [{ place_id: '0109' }];
  const okSuggestions = {
    loading: false,
    status: ok,
    data
  };
  const defaultSuggestions = {
    loading: false,
    status: '',
    // @ts-ignore
    data: []
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
                  cb(
                    type === 'success' ? data : null,
                    type === 'success' ? ok : error
                  );
                };
        }
      }
    }
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
    const callbackName = 'initMap';
    renderHook(() => usePlacesAutocomplete({ callbackName }));
    expect((window as any)[callbackName]).toBeUndefined();

    // @ts-ignore
    delete global.google;
    renderHook(() =>
      // @ts-ignore
      usePlacesAutocomplete({ callbackName, googleMaps: getMaps().maps })
    );
    expect((window as any)[callbackName]).toBeUndefined();

    renderHook(() => usePlacesAutocomplete({ callbackName }));
    expect((window as any)[callbackName]).toEqual(expect.any(Function));
  });

  it('should delete "callbackName" when un-mount', () => {
    const callbackName = 'initMap';
    const { unmount } = renderHook(() =>
      usePlacesAutocomplete({ callbackName })
    );
    unmount();
    expect((window as any)[callbackName]).toBeUndefined();
  });

  it('should throw error when no Places API', () => {
    // @ts-ignore
    delete global.google.maps.places;
    renderHook(() => usePlacesAutocomplete());

    // @ts-ignore
    delete global.google.maps;
    renderHook(() => usePlacesAutocomplete());

    // @ts-ignore
    delete global.google;
    renderHook(() => usePlacesAutocomplete());

    expect(console.error).toBeCalledTimes(3);
    expect(console.error).toBeCalledWith(loadApiErr);
  });

  it('should set debounce correctly', () => {
    renderHook(() => usePlacesAutocomplete());
    expect(_debounce).toBeCalledWith(expect.any(Function), 200);

    const debounce = 500;
    renderHook(() => usePlacesAutocomplete({ debounce }));
    expect(_debounce).toBeCalledWith(expect.any(Function), debounce);
  });

  it('should set "requestOptions" correctly', () => {
    // @ts-ignore
    global.google = getMaps('opts');
    const opts = { radius: 100 };
    const { result } = renderHook(() =>
      usePlacesAutocomplete({ requestOptions: opts })
    );
    result.current.setValue(val);
    expect(getPlacePredictions).toBeCalledWith(
      { ...opts, input: val },
      expect.any(Function)
    );
  });

  it('should return "ready" correctly', () => {
    // @ts-ignore
    delete global.google;
    let res = renderHook(() =>
      // @ts-ignore
      usePlacesAutocomplete({ googleMaps: getMaps().maps })
    ).result;
    expect(res.current.ready).toBeTruthy();

    res = renderHook(() => usePlacesAutocomplete()).result;
    expect(res.current.ready).toBeFalsy();

    // @ts-ignore
    global.google = getMaps();
    res = renderHook(() => usePlacesAutocomplete()).result;
    expect(res.current.ready).toBeTruthy();
  });

  it('should return "value" correctly', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    expect(result.current.value).toBe('');

    result.current.setValue(val);
    expect(result.current.value).toBe(val);
  });

  it('should return "suggestions" correctly', () => {
    let res = renderHook(() => usePlacesAutocomplete()).result;
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue('');
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue(val, false);
    expect(res.current.suggestions).toEqual(defaultSuggestions);

    res.current.setValue(val);
    expect(res.current.suggestions).toEqual(okSuggestions);

    // @ts-ignore
    global.google = getMaps('failure');
    res = renderHook(() => usePlacesAutocomplete()).result;
    res.current.setValue(val);
    expect(res.current.suggestions).toEqual({
      loading: false,
      status: error,
      data: []
    });
  });

  it('should clear suggestions', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    result.current.setValue(val);
    expect(result.current.suggestions).toEqual(okSuggestions);

    result.current.clearSuggestions();
    expect(result.current.suggestions).toEqual(defaultSuggestions);
  });
});
