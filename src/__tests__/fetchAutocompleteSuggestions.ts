import fetchAutocompleteSuggestions, {
  getPlacePredictions,
} from "../fetchAutocompleteSuggestions";
import { getLegacyPrediction, getLegacyPredictionErr } from "../utils";

describe("fetchAutocompleteSuggestions", () => {
  const mockResponse = {
    suggestions: [
      {
        placeId: "test-place-id",
        description: "test-description",
      },
    ],
  };

  it("Should return an Autocomplete Suggestion response", async () => {
    const mockRequest = { input: "test-input" };
    const response = await fetchAutocompleteSuggestions(mockRequest, {
      AutocompleteSuggestion: {
        fetchAutocompleteSuggestions: jest.fn().mockResolvedValue(mockResponse),
      },
    });
    expect(response).toEqual(mockResponse.suggestions);
  });
  it("Should throw an error if AutocompleteSuggestion API is not available", async () => {
    const mockRequest = { input: "test-input" };
    await expect(fetchAutocompleteSuggestions(mockRequest, {})).rejects.toThrow(
      "Google Maps AutocompleteSuggestion API is not available. Make sure the Maps JavaScript API is loaded with the correct libraries."
    );
  });
  it("Should throw an error if the API request fails", async () => {
    const mockRequest = { input: "test-input" };
    const mockApi = {
      AutocompleteSuggestion: {
        fetchAutocompleteSuggestions: jest
          .fn()
          .mockRejectedValue(new Error("API request failed")),
      },
    };
    await expect(
      fetchAutocompleteSuggestions(mockRequest, mockApi)
    ).rejects.toThrow("API request failed");
  });
  it("Should return a array of predictions", () => {
    const suggestions = [
      {
        placePrediction: {
          placeId: "1",
        },
      },
      {
        placePrediction: {
          placeId: "2",
        },
      },
    ] as unknown as google.maps.places.AutocompleteSuggestion[];
    const predictions = getPlacePredictions(suggestions);
    expect(predictions).toEqual([{ placeId: "1" }, { placeId: "2" }]);
  });
  it("Should be able to extract place details from a PlacePrediction", () => {
    const placePrediction = {
      placeId: "test-place-id",
      text: { text: "Test Place" },
      mainText: { text: "Test Main Text" },
      secondaryText: { text: "Test Secondary Text" },
    } as unknown as google.maps.places.PlacePrediction;

    const details = getLegacyPrediction(placePrediction);
    expect(details).toEqual({
      place_id: "test-place-id",
      structured_formatting: {
        main_text: "Test Main Text",
        secondary_text: "Test Secondary Text",
      },
      description: "Test Place",
    });
  });
  it("Should throw an error if PlacePrediction is invalid", () => {
    const invalidPlacePrediction =
      null as unknown as google.maps.places.PlacePrediction;
    expect(() => getLegacyPrediction(invalidPlacePrediction)).toThrow(
      getLegacyPredictionErr
    );
  });
});
