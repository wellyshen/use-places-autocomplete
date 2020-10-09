import { getZipCode, ZipCode } from "../utils";

describe("getZipCode", () => {
  const zipCode = {
    long_name: "12345",
    short_name: "123",
    types: ["postal_code"],
  };

  it("should handle success with long name correctly", () => {
    // @ts-expect-error
    return getZipCode({ address_components: [zipCode] }).then(
      (result: ZipCode) => {
        expect(result).toEqual(zipCode.long_name);
      }
    );
  });

  it("should handle success with short name correctly", () => {
    // @ts-expect-error
    return getZipCode({ address_components: [zipCode] }, true).then(
      (result: ZipCode) => {
        expect(result).toEqual(zipCode.short_name);
      }
    );
  });

  it("should handle success without result correctly", () => {
    // @ts-expect-error
    return getZipCode({ address_components: [] }).then((result: ZipCode) => {
      expect(result).toBeNull();
    });
  });

  it("should handle failure correctly", () => {
    // @ts-expect-error
    return getZipCode({}).catch((error) => {
      expect(error).toEqual(expect.any(Error));
    });
  });
});
