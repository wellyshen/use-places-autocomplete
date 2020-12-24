declare module "use-places-autocomplete" {
  // Hook
  export type RequestOptions = AutocompletionRequest;

  interface HookArgs {
    requestOptions?: RequestOptions;
    debounce?: number;
    googleMaps?: any;
    callbackName?: string;
    defaultValue?: string;
  }

  export type Suggestion = AutocompletePrediction;

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
  export type GeoArgs = GeocoderRequest;

  export type GeocodeResult = GeocoderResult;

  type GeoReturn = Promise<GeocodeResult[]>;

  export const getGeocode: (args: GeoArgs) => GeoReturn;

  export type LatLon = { lat: number; lng: number };

  type LatLngReturn = Promise<LatLon>;

  export const getLatLng: (result: GeocodeResult) => LatLngReturn;

  type ZipCode = string | null;

  type ZipCodeReturn = Promise<ZipCode>;

  export const getZipCode: (
    result: GeocodeResult,
    useShortName: boolean
  ) => ZipCodeReturn;

  export type GetDetailsArgs = PlaceDetailsRequest;

  type DetailsResult = Promise<PlaceResult | string>;

  export const getDetails: (args: GetDetailsArgs) => DetailsResult;
}
