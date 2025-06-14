import { fetchFields, fetchFieldsErr } from "../utils";

describe("Places 2025 API - fetchFields", () => {
  const mockPlace = {
    fetchFields: jest.fn().mockResolvedValue({
      place: { displayName: "test-name" },
    }),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    window.google = {
      maps: {
        places: {
          // @ts-ignore
          Place: jest.fn().mockImplementation(() => mockPlace),
        },
      },
    };
  });

  it("Should fetch fields for a given placeId", async () => {
    const args = {
      placeId: "test-place-id",
      fields: ["displayName"],
    };
    const result = await fetchFields(args);
    expect(mockPlace.fetchFields).toHaveBeenCalledWith({
      fields: args.fields,
    });
    expect(result).toEqual({ place: { displayName: "test-name" } });
  });
  it("Should throw an error if placeId is not provided", async () => {
    const args = {
      fields: ["displayName"],
    };
    // @ts-ignore
    await expect(fetchFields(args)).rejects.toThrow(fetchFieldsErr);
  });
});
