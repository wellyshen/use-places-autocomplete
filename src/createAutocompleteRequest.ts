// Converts legacy requestOptions to AutocompleteSuggestionInput for fetchAutocompleteSuggestions
export default function toAutocompleteSuggestionInput(
  requestOptions:
    | Partial<Omit<google.maps.places.AutocompletionRequest, "input">>
    | null
    | undefined,
  input: string
): google.maps.places.AutocompleteRequest {
  // Map legacy fields to new API fields as needed
  const {
    bounds,
    componentRestrictions,
    location,
    offset,
    origin,
    radius,
    sessionToken,
    types,
    // ...other fields if needed
  } = requestOptions || {};

  // The new API may not support all legacy fields, so only include those that are valid
  const suggestionInput: google.maps.places.AutocompleteRequest = {
    input,
    // Only include properties if they are defined and supported by the new API
    ...(location && { location }),
    ...(radius && { radius }),
    ...(bounds && { bounds }),
    ...(origin && { origin }),
    ...(offset && { offset }),
    ...(sessionToken && { sessionToken }),
    ...(types && { types }),
    ...(componentRestrictions && { componentRestrictions }),
  };

  return suggestionInput;
}
