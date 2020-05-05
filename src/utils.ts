export const geocodeErr =
  "> 💡use-places-autocomplete: Please provide an address when using getGeocode() with the componentRestrictions.";

type GeoArgs = google.maps.GeocoderRequest;
type GeocodeResult = google.maps.GeocoderResult;
type GeoReturn = Promise<GeocodeResult[]>;

export const getGeocode = (args: GeoArgs): GeoReturn => {
  const geocoder = new window.google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode(args, (results, status) => {
      if (status !== "OK") reject(status);
      if (!args.address && args.componentRestrictions) {
        console.error(geocodeErr);
        resolve(results);
      }
      resolve(results);
    });
  });
};

export type LatLng = { lat: number; lng: number };
type LatLngReturn = Promise<LatLng>;

export const getLatLng = (result: GeocodeResult): LatLngReturn =>
  new Promise((resolve, reject) => {
    try {
      const { lat, lng } = result.geometry.location;

      resolve({ lat: lat(), lng: lng() });
    } catch (error) {
      reject(error);
    }
  });

export type ZipCode = string | null;
type ZipCodeReturn = Promise<ZipCode>;

export const getZipCode = (
  result: GeocodeResult,
  useShortName: false
): ZipCodeReturn =>
  new Promise((resolve, reject) => {
    try {
      let zipCode = null;

      result.address_components.forEach(({ long_name, short_name, types }) => {
        if (types.includes("postal_code"))
          zipCode = useShortName ? short_name : long_name;
      });

      resolve(zipCode);
    } catch (error) {
      reject(error);
    }
  });
