import { renderHook, act } from '@testing-library/react-hooks';

import usePlacesAutocomplete, {
  loadApiErr
} from '../src/usePlacesAutocomplete';

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

describe('usePlacesAutocomplete', () => {
  global.console.error = jest.fn();

  const getPlacePredictions = jest.fn();
  const getMaps = (type = 'success'): object => ({
    maps: {
      places: {
        AutocompleteService: class {
          getPlacePredictions =
            type === 'opts'
              ? getPlacePredictions
              : (
                  opts: object,
                  cb: (data: object[] | null, status: string) => void
                ): void => {
                  cb(
                    type === 'success' ? [{ description: 'Taipei' }] : null,
                    type === 'success' ? 'OK' : 'ERROR'
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

  it('should return "setValue"', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    expect(result.current.setValue).toEqual(expect.any(Function));
  });

  it('should return "value" correctly', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    expect(result.current.value).toBe('');

    const val = 'usePlacesAutocomplete so Cool 😎';
    act(() => {
      result.current.setValue(val);
    });
    expect(result.current.value).toBe(val);
  });

  it('should set "requestOptions" correctly', () => {
    // @ts-ignore
    global.google = getMaps('opts');
    const opts = { radius: 100 };
    const { result } = renderHook(() =>
      usePlacesAutocomplete({ requestOptions: opts })
    );
    const val = 'usePlacesAutocomplete so Cool 😎';
    result.current.setValue(val);
    expect(getPlacePredictions).toBeCalledWith(
      { ...opts, input: val },
      expect.any(Function)
    );
  });
});
