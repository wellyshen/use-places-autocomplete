import { useState, useRef, useCallback, useEffect } from "react";
import _debounce from "lodash.debounce";

import useLatest from "./useLatest";

export const loadApiErr =
  "> 💡use-places-autocomplete: Google Maps Places API library must be loaded. See: https://github.com/wellyshen/use-places-autocomplete#load-the-library";

type RequestOptions = Omit<google.maps.places.AutocompletionRequest, "input">;
export interface HookArgs {
  requestOptions?: RequestOptions;
  debounce?: number;
  googleMaps?: any;
  callbackName?: string;
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
export interface HookReturn {
  readonly ready: boolean;
  readonly value: string;
  readonly suggestions: Suggestions;
  readonly setValue: SetValue;
  readonly clearSuggestions: () => void;
}

const usePlacesAutocomplete = ({
  requestOptions,
  debounce = 200,
  googleMaps,
  callbackName,
}: HookArgs = {}): HookReturn => {
  const [ready, setReady] = useState<boolean>(false);
  const [value, setVal] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestions>({
    loading: false,
    status: "",
    data: [],
  });
  const asRef = useRef(null);
  const requestOptionsRef = useLatest<RequestOptions>(requestOptions);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // To keep the previous suggestions
      setSuggestions((prevState) => ({ ...prevState, loading: true }));

      asRef.current.getPlacePredictions(
        { ...requestOptionsRef.current, input: val },
        (data: Suggestion[] | null, status: string) => {
          setSuggestions({ loading: false, status, data: data || [] });
        }
      );
    }, debounce),
    [debounce, clearSuggestions]
  );

  const setValue: SetValue = useCallback(
    (val, shouldFetchData = true) => {
      setVal(val);
      if (shouldFetchData) fetchPredictions(val);
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

    return (): void => {
      if ((window as any)[callbackName]) delete (window as any)[callbackName];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackName, init]);

  return { ready, value, suggestions, setValue, clearSuggestions };
};

export default usePlacesAutocomplete;
