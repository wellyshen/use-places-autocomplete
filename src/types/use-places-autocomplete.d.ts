/* eslint-disable */

declare module 'use-places-autocomplete' {
  /** Types from @types/googlemaps */
  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    constructor(literal: LatLngLiteral, noWrap?: boolean);
    equals(other: LatLng): boolean;
    lat(): number;
    lng(): number;
    toString(): string;
    toUrlValue(precision?: number): string;
    toJSON(): LatLngLiteral;
  }
  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    contains(latLng: LatLng | LatLngLiteral): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toJSON(): LatLngBoundsLiteral;
    toSpan(): LatLng;
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
    location?: LatLng;
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

  /** Types of the hook */
  export type RequestOptions = AutocompletionRequest;
  interface Args {
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
  interface Return {
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
  }?: Args) => Return;

  export default usePlacesAutocomplete;
}
