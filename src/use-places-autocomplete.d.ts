declare module "use-places-autocomplete" {
  // Hook
  export type RequestOptions = Omit<
    google.maps.places.AutocompletionRequest,
    "input"
  >;

  export interface HookArgs {
    requestOptions?: RequestOptions;
    debounce?: number;
    cache?: number | false;
    cacheKey?: string;
    googleMaps?: any;
    callbackName?: string;
    defaultValue?: string;
    initOnMount?: boolean;
  }

  export type Suggestion = google.maps.places.AutocompletePrediction;

  export type Status = `${google.maps.places.PlacesServiceStatus}` | "";

  export interface Suggestions {
    readonly loading: boolean;
    readonly status: Status;
    data: Suggestion[];
  }

  export interface SetValue {
    (val: string, shouldFetchData?: boolean): void;
  }

  export interface ClearSuggestions {
    (): void;
  }

  export interface ClearCache {
    (key?: string): void;
  }

  export interface Init {
    (): void;
  }

  export interface HookReturn {
    ready: boolean;
    value: string;
    suggestions: Suggestions;
    setValue: SetValue;
    clearSuggestions: ClearSuggestions;
    clearCache: ClearCache;
    init: Init;
  }

  const usePlacesAutocomplete: (args?: HookArgs) => HookReturn;

  export default usePlacesAutocomplete;

  // Utils
  export type GeoArgs = google.maps.GeocoderRequest;

  export type GeocodeResult = google.maps.GeocoderResult;

  export type GeoReturn = Promise<GeocodeResult[]>;

  export const getGeocode: (args: GeoArgs) => GeoReturn;

  export type LatLng = { lat: number; lng: number };

  export const getLatLng: (result: GeocodeResult) => LatLng;

  export type ZipCode = string | undefined;

  export const getZipCode: (
    result: GeocodeResult,
    useShortName: boolean
  ) => ZipCode;

  export type GetDetailsArgs = google.maps.places.PlaceDetailsRequest;

  export type DetailsResult = Promise<google.maps.places.PlaceResult | string>;

  export const getDetails: (args: GetDetailsArgs) => DetailsResult;
}
