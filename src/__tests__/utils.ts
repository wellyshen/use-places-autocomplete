import {
  getGeocode,
  getLatLng,
  LatLon,
  getZipCode,
  ZipCode,
  geocodeErr,
} from "../utils";

describe("getGeocode", () => {
  const data = [{ place_id: "0109" }];
  const error = "ERROR";
  const geocode = jest.fn();
  const setupMaps = (type = "success"): void => {
    // @ts-ignore
    global.google = {
      maps: {
        Geocoder: class {
          geocode =
            type === "opts"
              ? geocode
              : (
                  _: object,
                  cb: (data: object[] | null, status: string) => void
                ): void => {
                  cb(
                    type === "success" ? data : null,
                    type === "success" ? "OK" : error
                  );
                };
        },
      },
    };
  };

  it("should set options correctly", () => {
    setupMaps("opts");
    const opts = { address: "Taipei", placeId: "0109" };
    getGeocode(opts);
    expect(geocode).toHaveBeenCalledWith(opts, expect.any(Function));
  });

  it("should handle success correctly", () => {
    setupMaps();
    return getGeocode({ address: "Taipei" }).then((results) => {
      expect(results).toBe(data);
    });
  });

  it("should handle failure correctly", () => {
    setupMaps("failure");
    return getGeocode({ address: "Taipei" }).catch((err) => {
      expect(err).toBe(error);
    });
  });

  it("should restrict the result to Taiwan and fail", () => {
    setupMaps("failure");
    return getGeocode({
      address: "Belgrade",
      componentRestrictions: { country: "TW" },
    }).catch((err) => {
      expect(err).toBe(error);
    });
  });

  it("should restrict the result to Taiwan and pass", () => {
    setupMaps();
    return getGeocode({
      address: "Taipei",
      componentRestrictions: { country: "TW" },
    }).then((results) => {
      expect(results).toBe(data);
    });
  });

  it("should throw error when providing componentRestrictions without address", () => {
    console.error = jest.fn();

    setupMaps();
    return getGeocode({
      componentRestrictions: { country: "TW", postalCode: "100" },
    }).then((results) => {
      expect(console.error).toHaveBeenCalledWith(geocodeErr);
      expect(results).toBe(data);
    });
  });
});

describe("getLatLng", () => {
  it("should handle success correctly", () => {
    const latLng = { lat: 123, lng: 456 };
    return getLatLng({
      geometry: {
        // @ts-ignore
        location: {
          lat: (): number => latLng.lat,
          lng: (): number => latLng.lng,
        },
      },
    }).then((result: LatLon) => {
      expect(result).toEqual(latLng);
    });
  });

  it("should handle failure correctly", () => {
    // @ts-ignore
    return getLatLng({}).catch((error) => {
      expect(error).toEqual(expect.any(Error));
    });
  });
});

describe("getZipCode", () => {
  const zipCode = {
    long_name: "12345",
    short_name: "123",
    types: ["postal_code"],
  };

  it("should handle success with long name correctly", () => {
    // @ts-ignore
    return getZipCode({ address_components: [zipCode] }).then(
      (result: ZipCode) => {
        expect(result).toEqual(zipCode.long_name);
      }
    );
  });

  it("should handle success with short name correctly", () => {
    // @ts-ignore
    return getZipCode({ address_components: [zipCode] }, true).then(
      (result: ZipCode) => {
        expect(result).toEqual(zipCode.short_name);
      }
    );
  });

  it("should handle success without result correctly", () => {
    // @ts-ignore
    return getZipCode({ address_components: [] }).then((result: ZipCode) => {
      expect(result).toBeNull();
    });
  });

  it("should handle failure correctly", () => {
    // @ts-ignore
    return getZipCode({}).catch((error) => {
      expect(error).toEqual(expect.any(Error));
    });
  });
});
