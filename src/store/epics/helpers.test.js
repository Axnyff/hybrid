import {
  looseComp,
  strictComp,
  hasOverlap,
  normalize,
  detectWinOrLost
} from "./helpers";

describe("looseComp", () => {
  it("should work", () => {
    expect(looseComp(3, 4)).toBe(true);
    expect(looseComp(4, 4)).toBe(true);
    expect(looseComp(5, 4)).toBe(false);
  });
});
describe("strictComp", () => {
  it("should work", () => {
    expect(strictComp(3, 4)).toBe(true);
    expect(strictComp(4, 4)).toBe(false);
    expect(strictComp(5, 4)).toBe(false);
  });
});

describe("hasOverlap", () => {
  it("should detect overlap in default comp", () => {
    const entityA = {
      x: 20,
      width: 20,
      y: 20,
      height: 20
    };

    const entityB = {
      x: 30,
      width: 20,
      y: 30,
      height: 20
    };

    expect(hasOverlap(entityA, entityB)).toBe(true);
  });
  it("should be strict by default", () => {
    const entityA = {
      x: 40,
      width: 20,
      y: 40,
      height: 20
    };

    const entityB = {
      x: 20,
      width: 20,
      y: 20,
      height: 20
    };
    expect(hasOverlap(entityA, entityB)).toBe(false);
  });
});

describe("normalize", () => {
  it("should normalize bottom value", () => {
    expect(normalize(-4, 30, [0, 20])).toBe(0);
  });
  it("should normalize top value", () => {
    expect(normalize(-4, 30, [-20, 20])).toBe(-10);
  });
  it("should leave untouched otherwise", () => {
    expect(normalize(-4, 30, [-20, 200])).toBe(-4);
  });
});

describe("detectWinOrLost", () => {
  const playerEntity = {
    x: 20,
    y: 0,
    width: 20,
    height: 20
  };
  it("should detect a lost if a trap is touching", () => {
    const state = {
      window: {
        width: 1000,
        height: 1000
      },
      entities: [
        {
          type: "trap",
          x: 20,
          y: 0,
          width: 1,
          height: 1
        }
      ]
    };
    expect(detectWinOrLost(playerEntity, state)[1]).toBe(true);
  });
  it("should detect a win if a door is touching", () => {
    const state = {
      window: {
        width: 1000,
        height: 1000
      },
      entities: [
        {
          type: "door",
          x: 20,
          y: 0,
          width: 1,
          height: 1
        }
      ]
    };
    expect(detectWinOrLost(playerEntity, state)[0]).toBe(true);
  });
  it("should detect a lost if the player is crushed", () => {
    const state = {
      window: {
        width: 1000,
        height: 1000
      },
      entities: [
        {
          type: "platform",
          x: 20,
          y: 15,
          width: 1,
          height: 5
        }
      ]
    };
    expect(detectWinOrLost(playerEntity, state)[1]).toBe(true);
  });
});
