/* eslint-disable */

declare module 'use-places-autocomplete' {
  /** Types from @types/googlemaps */
  /** Hook */
  class GLatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    constructor(literal: LatLngLiteral, noWrap?: boolean);
    equals(other: GLatLng): boolean;
    lat(): number;
    lng(): number;
    toString(): string;
    toUrlValue(precision?: number): string;
    toJSON(): LatLngLiteral;
  }

  class LatLngBounds {
    constructor(sw?: GLatLng | LatLngLiteral, ne?: GLatLng | LatLngLiteral);
    contains(latLng: GLatLng | LatLngLiteral): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: GLatLng | LatLngLiteral): LatLngBounds;
    getCenter(): GLatLng;
    getNorthEast(): GLatLng;
    getSouthWest(): GLatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toJSON(): LatLngBoundsLiteral;
    toSpan(): GLatLng;
    toString(): string;
    toUrlValue(precision?: number): string;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
  }

  class AutocompleteSessionToken {}

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }

  interface ComponentRestrictions {
    country: string | string[];
  }

  interface AutocompletionRequest {
    bounds?: LatLngBounds | LatLngBoundsLiteral;
    componentRestrictions?: ComponentRestrictions;
    location?: GLatLng;
    offset?: number;
    radius?: number;
    sessionToken?: AutocompleteSessionToken;
    types?: string[];
  }

  interface PredictionSubstring {
    length: number;
    offset: number;
  }

  interface AutocompleteStructuredFormatting {
    main_text: string;
    main_text_matched_substrings: PredictionSubstring[];
    secondary_text: string;
    secondary_text_matched_substrings?: PredictionSubstring[];
  }

  interface PredictionTerm {
    offset: number;
    value: string;
  }

  interface AutocompletePrediction {
    description: string;
    id: string;
    matched_substrings: PredictionSubstring[];
    place_id: string;
    reference: string;
    structured_formatting: AutocompleteStructuredFormatting;
    terms: PredictionTerm[];
    types: string[];
  }

  /** Geocoding */
  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  enum GeocoderLocationType {
    APPROXIMATE = 'APPROXIMATE',
    GEOMETRIC_CENTER = 'GEOMETRIC_CENTER',
    RANGE_INTERPOLATED = 'RANGE_INTERPOLATED',
    ROOFTOP = 'ROOFTOP'
  }

  interface GeocoderGeometry {
    bounds: LatLngBounds;
    location: GLatLng;
    location_type: GeocoderLocationType;
    viewport: LatLngBounds;
  }

  interface GeocoderResult {
    address_components: GeocoderAddressComponent[];
    formatted_address: string;
    geometry: GeocoderGeometry;
    partial_match: boolean;
    place_id: string;
    postcode_localities: string[];
    types: string[];
  }

  /** Hook types */
  export type RequestOptions = AutocompletionRequest;

  interface HookArgs {
    requestOptions?: RequestOptions;
    debounce?: number;
    googleMaps?: any;
    callbackName?: string;
  }

  export type Suggestion = AutocompletePrediction;

  export interface Suggestions {
    readonly loading: boolean;
    readonly status: string;
    readonly data: Suggestion[];
  }

  interface HookReturn {
    readonly ready: boolean;
    readonly value: string;
    readonly suggestions: Suggestions;
    readonly setValue: (val: string, shouldFetchData?: boolean) => void;
    readonly clearSuggestions: () => void;
  }

  const usePlacesAutocomplete: ({
    requestOptions,
    debounce,
    googleMaps,
    callbackName
  }?: HookArgs) => HookReturn;

  export default usePlacesAutocomplete;

  /** Geocoding types */
  interface GeoArgs {
    address?: string;
    placeId?: string;
  }

  export type GeocodeResult = google.maps.GeocoderResult;

  type GeoReturn = Promise<GeocodeResult[]>;

  export const getGeocode: ({ address, placeId }: GeoArgs) => GeoReturn;

  export type LatLng = { lat: number; lng: number };

  type LatLngReturn = Promise<LatLng>;

  export const getLatLng: (result: GeocodeResult) => LatLngReturn;
}
