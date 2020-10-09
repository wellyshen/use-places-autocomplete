import { getDetailsErr, getDetails } from "../utils";

describe("getDetails", () => {
  const data = { formatted_address: "123", name: "abc" };
  const error = "ERROR";
  const getDetailsFn = jest.fn();
  const autocompletePrediction = {
    description: "1230 East 38th 1/2 Street, Austin, TX, USA",
    matched_substrings: [
      {
        length: 3,
        offset: 0,
      },
    ],
    place_id: "ChIJW0rEhvO1RIYRNbiY896zeNw",
    reference: "ChIJW0rEhvO1RIYRNbiY896zeNw",
    structured_formatting: {
      main_text: "1230 East 38th 1/2 Street",
      main_text_matched_substrings: [
        {
          length: 3,
          offset: 0,
        },
      ],
      secondary_text: "Austin, TX, USA",
    },
    terms: [
      {
        offset: 0,
        value: "1230",
      },
      {
        offset: 5,
        value: "East 38th 1/2 Street",
      },
      {
        offset: 27,
        value: "Austin",
      },
      {
        offset: 35,
        value: "TX",
      },
      {
        offset: 39,
        value: "USA",
      },
    ],
    types: ["street_address", "geocode"],
  };
  const setupMaps = (type = "success") => {
    global.google = {
      maps: {
        places: {
          // @ts-expect-error
          PlacesService: class {
            getDetails =
              type === "opts"
                ? getDetailsFn
                : (_: any, cb: (dataArg: any, status: string) => void) => {
                    cb(
                      type === "success" ? data : null,
                      type === "success" ? "OK" : error
                    );
                  };
          },
        },
      },
    };
  };

  it("should make call with places_id when placesId passed in", () => {
    setupMaps("opts");
    const opts = "0109";
    getDetails(opts);
    expect(getDetailsFn).toHaveBeenCalledWith(
      { placeId: "0109" },
      expect.any(Function)
    );
  });

  it("should make call with places_id when AutocompletePrediction passed in", () => {
    setupMaps("opts");
    getDetails(autocompletePrediction);
    expect(getDetailsFn).toHaveBeenCalledWith(
      { placeId: "0109" },
      expect.any(Function)
    );
  });

  it("should handle success correctly", () => {
    setupMaps();
    return getDetails("0109").then((results) => {
      expect(results).toBe(data);
    });
  });

  it("should throw error when place_id is not provided", () => {
    console.error = jest.fn();

    const auto = { ...autocompletePrediction, place_id: null };
    setupMaps();
    // @ts-expect-error
    return getDetails(auto).catch((err) => {
      expect(console.error).toHaveBeenCalledWith(getDetailsErr);
      expect(err).toBe(getDetailsErr);
    });
  });

  it("should handle failure correctly", () => {
    const auto = { ...autocompletePrediction, place_id: "" };
    setupMaps("failure");
    return getDetails(auto).catch((err) => {
      expect(err).toBe(error);
    });
  });
});
