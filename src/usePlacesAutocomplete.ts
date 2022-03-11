/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useRef, useCallback, useEffect } from "react";

import useLatest from "./useLatest";
import _debounce from "./debounce";

export interface HookArgs {
  requestOptions?: Omit<google.maps.places.AutocompletionRequest, "input">;
  debounce?: number;
  cache?: number | false;
  cacheKey?: string;
  googleMaps?: any;
  callbackName?: string;
  defaultValue?: string;
  initOnMount?: boolean;
}

type Suggestion = google.maps.places.AutocompletePrediction;

type Status = `${google.maps.places.PlacesServiceStatus}` | "";

interface Suggestions {
  readonly loading: boolean;
  readonly status: Status;
  data: Suggestion[];
}

interface SetValue {
  (val: string, shouldFetchData?: boolean): void;
}

interface HookReturn {
  ready: boolean;
  value: string;
  suggestions: Suggestions;
  setValue: SetValue;
  clearSuggestions: () => void;
  clearCache: () => void;
  init: () => void;
}

export const loadApiErr =
  "💡 use-places-autocomplete: Google Maps Places API library must be loaded. See: https://github.com/wellyshen/use-places-autocomplete#load-the-library";

const usePlacesAutocomplete = ({
  requestOptions,
  debounce = 200,
  cache = 24 * 60 * 60,
  cacheKey,
  googleMaps,
  callbackName,
  defaultValue = "",
  initOnMount = true,
}: HookArgs = {}): HookReturn => {
  const [ready, setReady] = useState(false);
  const [value, setVal] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestions>({
    loading: false,
    status: "",
    data: [],
  });
  const asRef = useRef(null);
  const requestOptionsRef = useLatest(requestOptions);
  const googleMapsRef = useLatest(googleMaps);
  const cacheRef = useLatest(cache);
  const upaCacheKeyRef = useLatest(cacheKey ? `upa-${cacheKey}` : "upa");

  const init = useCallback(() => {
    if (asRef.current) return;

    const { google } = window;
    const { current: gMaps } = googleMapsRef;
    const placesLib = gMaps?.places || google?.maps?.places;

    if (!placesLib) {
      console.error(loadApiErr);
      return;
    }

    asRef.current = new placesLib.AutocompleteService();
    setReady(true);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions({ loading: false, status: "", data: [] });
  }, []);

  const clearCache = useCallback(() => {
    if (upaCacheKeyRef.current) {
      try {
        sessionStorage.removeItem(upaCacheKeyRef.current);
      } catch (error) {
        // Skip exception
      }
    }
  }, []);

  const fetchPredictions = useCallback(
    _debounce((val: string) => {
      if (!val) {
        clearSuggestions();
        return;
      }

      setSuggestions((prevState) => ({ ...prevState, loading: true }));

      let cachedData: Record<string, { data: Suggestion[]; maxAge: number }> =
        {};

      if (upaCacheKeyRef.current) {
        try {
          cachedData = JSON.parse(
            sessionStorage.getItem(upaCacheKeyRef.current) || "{}"
          );
        } catch (error) {
          // Skip exception
        }
      }

      if (cacheRef.current) {
        cachedData = Object.keys(cachedData).reduce(
          (acc: typeof cachedData, key) => {
            if (cachedData[key].maxAge - Date.now() >= 0)
              acc[key] = cachedData[key];
            return acc;
          },
          {}
        );

        if (cachedData[val]) {
          setSuggestions({
            loading: false,
            status: "OK",
            data: cachedData[val].data,
          });
          return;
        }
      }

      // @ts-expect-error
      asRef.current.getPlacePredictions(
        { ...requestOptionsRef.current, input: val },
        (data: Suggestion[] | null, status: Status) => {
          setSuggestions({ loading: false, status, data: data || [] });

          if (cacheRef.current && status === "OK") {
            cachedData[val] = {
              data: data as Suggestion[],
              maxAge: Date.now() + cacheRef.current * 1000,
            };

            if (upaCacheKeyRef.current) {
              try {
                sessionStorage.setItem(
                  upaCacheKeyRef.current,
                  JSON.stringify(cachedData)
                );
              } catch (error) {
                // Skip exception
              }
            }
          }
        }
      );
    }, debounce),
    [debounce, clearSuggestions]
  );

  const setValue: SetValue = useCallback(
    (val, shouldFetchData = true) => {
      setVal(val);
      if (asRef.current && shouldFetchData) fetchPredictions(val);
    },
    [fetchPredictions]
  );

  useEffect(() => {
    if (!initOnMount) return () => null;

    const { google } = window;

    if (!googleMapsRef.current && !google?.maps && callbackName) {
      (window as any)[callbackName] = init;
    } else {
      init();
    }

    return () => {
      // @ts-expect-error
      if ((window as any)[callbackName]) delete (window as any)[callbackName];
    };
  }, [callbackName, init]);

  return {
    ready,
    value,
    suggestions,
    setValue,
    clearSuggestions,
    clearCache,
    init,
  };
};

export default usePlacesAutocomplete;
