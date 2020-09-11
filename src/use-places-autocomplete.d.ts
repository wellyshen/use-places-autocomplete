declare module "use-places-autocomplete" {
  /* Types from @types/googlemaps */
  // Hook
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
    origin?: LatLng | LatLngLiteral;
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
    distance_meters?: number;
    id?: string;
    matched_substrings: PredictionSubstring[];
    place_id: string;
    reference: string;
    structured_formatting: AutocompleteStructuredFormatting;
    terms: PredictionTerm[];
    types: string[];
  }

  // Geocoding
  interface GeocoderComponentRestrictions {
    administrativeArea?: string;
    country?: string | string[];
    locality?: string;
    postalCode?: string;
    route?: string;
  }

  interface GeocoderRequest {
    address?: string;
    bounds?: LatLngBounds | LatLngBoundsLiteral;
    componentRestrictions?: GeocoderComponentRestrictions;
    location?: LatLng | LatLngLiteral;
    placeId?: string;
    region?: string;
  }

  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  enum GeocoderLocationType {
    APPROXIMATE = "APPROXIMATE",
    GEOMETRIC_CENTER = "GEOMETRIC_CENTER",
    RANGE_INTERPOLATED = "RANGE_INTERPOLATED",
    ROOFTOP = "ROOFTOP",
  }

  interface GeocoderGeometry {
    bounds: LatLngBounds;
    location: LatLng;
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

  // getDetails
  interface PlaceResult {
    address_components?: GeocoderAddressComponent[];
    adr_address?: string;
    aspects?: PlaceAspectRating[];
    formatted_address?: string;
    formatted_phone_number?: string;
    geometry?: PlaceGeometry;
    html_attributions?: string[];
    icon?: string;
    id?: string;
    international_phone_number?: string;
    name: string;
    opening_hours?: OpeningHours;
    permanently_closed?: boolean;
    photos?: PlacePhoto[];
    place_id?: string;
    plus_code?: PlacePlusCode;
    price_level?: number;
    rating?: number;
    reviews?: PlaceReview[];
    types?: string[];
    url?: string;
    user_ratings_total?: number;
    utc_offset?: number;
    utc_offset_minutes?: number;
    vicinity?: string;
    website?: string;
  }

  interface PlaceAspectRating {
    rating: number;
    type: string;
  }

  interface PlaceGeometry {
    location: LatLng;
    viewport: LatLngBounds;
  }

  interface OpeningHours {
    open_now: boolean;
    periods: OpeningPeriod[];
    weekday_text: string[];
    isOpen(date?: Date): boolean;
  }

  interface OpeningPeriod {
    open: OpeningHoursTime;
    close?: OpeningHoursTime;
  }

  interface OpeningHoursTime {
    day: number;
    hours: number;
    minutes: number;
    nextDate: number;
    time: string;
  }

  interface PlacePhoto {
    height: number;
    html_attributions: string[];
    width: number;
    getUrl(opts: PhotoOptions): string;
  }

  interface PhotoOptions {
    maxHeight?: number;
    maxWidth?: number;
  }

  interface PlacePlusCode {
    compound_code?: string;
    global_code: string;
  }

  interface PlaceReview {
    aspects: PlaceAspectRating[];
    author_name: string;
    author_url?: string;
    language: string;
    profile_photo_url: string;
    rating: number;
    relative_time_description: string;
    text: string;
    time: number;
  }

  /* Hook types */
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
    readonly ready: boolean;
    readonly value: string;
    readonly suggestions: Suggestions;
    readonly setValue: (val: string, shouldFetchData?: boolean) => void;
    readonly clearSuggestions: () => void;
  }

  const usePlacesAutocomplete: (args?: HookArgs) => HookReturn;

  export default usePlacesAutocomplete;

  // Geocoding types
  type GeoArgs = GeocoderRequest;

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

  // getDetails types
  type GetDetailsArgs = AutocompletePrediction | string;

  type DetailsResult = Promise<PlaceResult | string>;

  export const getDetails: (args: GetDetailsArgs) => DetailsResult;
}
