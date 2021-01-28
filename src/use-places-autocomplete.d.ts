declare module "use-places-autocomplete" {
  // Hook
  export type RequestOptions = Omit<
    google.maps.places.AutocompletionRequest,
    "input"
  >;

  interface HookArgs {
    requestOptions?: RequestOptions;
    debounce?: number;
    cache?: number | false;
    googleMaps?: any;
    callbackName?: string;
    defaultValue?: string;
  }

  export type Suggestion = google.maps.places.AutocompletePrediction;

  export interface Suggestions {
    readonly loading: boolean;
    readonly status: string;
    readonly data: Suggestion[];
  }

  interface HookReturn {
    ready: boolean;
    value: string;
    suggestions: Suggestions;
    setValue: (val: string, shouldFetchData?: boolean) => void;
    clearSuggestions: () => void;
  }

  const usePlacesAutocomplete: (args?: HookArgs) => HookReturn;

  export default usePlacesAutocomplete;

  // Utils
  export type GeoArgs = google.maps.GeocoderRequest;

  export type GeocodeResult = google.maps.GeocoderResult;

  type GeoReturn = Promise<GeocodeResult[]>;

  export const getGeocode: (args: GeoArgs) => GeoReturn;

  export type LatLon = { lat: number; lng: number };

  type LatLngReturn = Promise<LatLon>;

  export const getLatLng: (result: GeocodeResult) => LatLngReturn;

  type ZipCodeReturn = Promise<string | null>;

  export const getZipCode: (
    result: GeocodeResult,
    useShortName: boolean
  ) => ZipCodeReturn;

  export type GetDetailsArgs = google.maps.places.PlaceDetailsRequest;

  type DetailsResult = Promise<google.maps.places.PlaceResult | string>;

  export const getDetails: (args: GetDetailsArgs) => DetailsResult;
}
