import { getZipCode } from "../utils";

const zipCode = {
  long_name: "12345",
  short_name: "123",
  types: ["postal_code"],
};

describe("getZipCode", () => {
  it("should handle success with long name correctly", () => {
    // @ts-ignore
    expect(getZipCode({ address_components: [zipCode] })).toEqual(
      zipCode.long_name
    );
  });

  it("should handle success with short name correctly", () => {
    // @ts-ignore
    expect(getZipCode({ address_components: [zipCode] }, true)).toEqual(
      zipCode.short_name
    );
  });

  it("should handle success without result correctly", () => {
    // @ts-ignore
    expect(getZipCode({ address_components: [] })).toBeUndefined();
  });
});
