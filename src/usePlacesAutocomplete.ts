/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useRef, useCallback, useEffect } from "react";

import useLatest from "./useLatest";
import _debounce from "./debounce";

export const loadApiErr =
  "💡 use-places-autocomplete: Google Maps Places API library must be loaded. See: https://github.com/wellyshen/use-places-autocomplete#load-the-library";

export interface HookArgs {
  requestOptions?: Omit<google.maps.places.AutocompletionRequest, "input">;
  debounce?: number;
  cache?: number | false;
  googleMaps?: any;
  callbackName?: string;
  defaultValue?: string;
}
type Suggestion = google.maps.places.AutocompletePrediction;
interface Suggestions {
  readonly loading: boolean;
  readonly status: string;
  readonly data: Suggestion[];
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
}

const usePlacesAutocomplete = ({
  requestOptions,
  debounce = 200,
  cache = 24 * 60 * 60,
  googleMaps,
  callbackName,
  defaultValue = "",
}: HookArgs = {}): HookReturn => {
  const [ready, setReady] = useState<boolean>(false);
  const [value, setVal] = useState<string>(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestions>({
    loading: false,
    status: "",
    data: [],
  });
  const asRef = useRef(null);
  const requestOptionsRef = useLatest(requestOptions);
  const googleMapsRef = useLatest(googleMaps);

  const init = useCallback(() => {
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

  const fetchPredictions = useCallback(
    _debounce((val: string) => {
      if (!val) {
        clearSuggestions();
        return;
      }

      setSuggestions((prevState) => ({ ...prevState, loading: true }));

      let cachedData = JSON.parse(
        sessionStorage.getItem("upa") || "{}"
      ) as Record<string, { data: Suggestion[]; maxAge: number }>;

      if (cache) {
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
        (data: Suggestion[] | null, status: string) => {
          setSuggestions({ loading: false, status, data: data || [] });

          if (cache && status === "OK") {
            cachedData[val] = {
              data: data as Suggestion[],
              maxAge: Date.now() + cache * 1000,
            };

            try {
              sessionStorage.setItem("upa", JSON.stringify(cachedData));
            } catch (error) {
              // skip exception
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

  return { ready, value, suggestions, setValue, clearSuggestions };
};

export default usePlacesAutocomplete;
