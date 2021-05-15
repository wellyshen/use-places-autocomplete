import { getLatLng, LatLon } from "../utils";

describe("getLatLng", () => {
  it("should handle success correctly", () => {
    const latLng = { lat: 123, lng: 456 };
    return getLatLng({
      geometry: {
        // @ts-expect-error
        location: {
          lat: (): number => latLng.lat,
          lng: (): number => latLng.lng,
        },
      },
    }).then((result: LatLon) => {
      expect(result).toEqual(latLng);
    });
  });

  it("should handle failure correctly", async () => {
    let err;
    try {
      // @ts-expect-error
      await getLatLng({});
    } catch (someErr) {
      err = someErr;
    }
    expect(err).toEqual(expect.any(Error));
  });
});
