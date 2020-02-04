import { renderHook, act } from '@testing-library/react-hooks';

import usePlacesAutocomplete from '../src/usePlacesAutocomplete';

describe('usePlacesAutocomplete', () => {
  it('should assign the init() as the global variable of Google script callback', () => {
    // TODO: test API loaded case
    const callbackName = 'initMap';
    renderHook(() => usePlacesAutocomplete({ callbackName }));
    expect((window as any)[callbackName]).toEqual(expect.any(Function));
  });

  it('should delete the global variable of Google script callback when un-mount', () => {
    const callbackName = 'initMap';
    const { unmount } = renderHook(() =>
      usePlacesAutocomplete({ callbackName })
    );
    unmount();
    expect((window as any)[callbackName]).toBeUndefined();
  });

  it('should return input value correctly', () => {
    const { result } = renderHook(() => usePlacesAutocomplete());
    const value = 'usePlacesAutocomplete so Cool 😎';
    act(() => {
      result.current.setValue(value);
    });
    expect(result.current.value).toBe(value);
  });
});
