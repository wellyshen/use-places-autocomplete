import { getLatLng } from "../utils";

describe("getLatLng", () => {
  it("should handle success correctly", () => {
    const latLng = { lat: 123, lng: 456 };
    const result = getLatLng({
      geometry: {
        // @ts-ignore
        location: {
          lat: (): number => latLng.lat,
          lng: (): number => latLng.lng,
        },
      },
    });
    expect(result).toEqual(latLng);
  });
});
