import createAutocompleteRequest from "../createAutocompleteRequest";

describe("toAutocompleteSuggestionInput", () => {
  it("should convert requestOptions and input to AutocompleteSuggestionInput", () => {
    // Mock sessionToken as an object, not a string
    const mockSessionToken = {};
    const requestOptions = {
      radius: 500,
      bounds: { east: 1, north: 2, south: 3, west: 4 },
      offset: 2,
      sessionToken: mockSessionToken,
      types: ["address"],
      componentRestrictions: { country: "us" },
    };
    const input = "pizza";

    const result = createAutocompleteRequest(requestOptions, input);

    expect(result).toEqual({
      input: "pizza",
      radius: 500,
      bounds: { east: 1, north: 2, south: 3, west: 4 },
      offset: 2,
      sessionToken: mockSessionToken,
      types: ["address"],
      componentRestrictions: { country: "us" },
    });
  });

  it("should handle missing optional fields", () => {
    const requestOptions = {};
    const input = "coffee";
    const result = createAutocompleteRequest(requestOptions, input);
    expect(result).toEqual({ input: "coffee" });
  });

  it("should handle undefined requestOptions", () => {
    const input = "bar";
    const result = createAutocompleteRequest(undefined, input);
    expect(result).toEqual({ input: "bar" });
  });
});
