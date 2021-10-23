import { getZipCode, ZipCode } from "../utils";

const zipCode = {
  long_name: "12345",
  short_name: "123",
  types: ["postal_code"],
};

describe("getZipCode", () => {
  it("should handle success with long name correctly", () =>
    // @ts-expect-error
    getZipCode({ address_components: [zipCode] }).then((result: ZipCode) =>
      expect(result).toEqual(zipCode.long_name)
    ));

  it("should handle success with short name correctly", () =>
    // @ts-expect-error
    getZipCode({ address_components: [zipCode] }, true).then(
      (result: ZipCode) => expect(result).toEqual(zipCode.short_name)
    ));

  it("should handle success without result correctly", () =>
    // @ts-expect-error
    getZipCode({ address_components: [] }).then((result: ZipCode) =>
      expect(result).toBeNull()
    ));

  it("should handle failure correctly", async () => {
    let err;
    try {
      // @ts-expect-error
      await getZipCode({});
    } catch (someErr) {
      err = someErr;
    }
    expect(err).toEqual(expect.any(Error));
  });
});
