import { tasksQtyEmoji } from "../tasksQtyEmoji";

describe("tasksQtyEmoji", () => {
  it("Should return a shrugging emoji", () => {
    expect(tasksQtyEmoji(0)).toBe("🤷‍♂️");
  });

  it("Should return a thumbs up emoji", () => {
    expect(tasksQtyEmoji(1)).toBe("👌");
    expect(tasksQtyEmoji(4)).toBe("👌");
  });

  it("Should return a fire emoji", () => {
    expect(tasksQtyEmoji(5)).toBe("🔥");
    expect(tasksQtyEmoji(9)).toBe("🔥");
  });

  it("Should return a rocket emoji", () => {
    expect(tasksQtyEmoji(10)).toBe("🚀");
    expect(tasksQtyEmoji(19)).toBe("🚀");
  });

  it("Should return a mind blown emoji", () => {
    expect(tasksQtyEmoji(20)).toBe("🤯");
    expect(tasksQtyEmoji(100)).toBe("🤯");
  });
});
