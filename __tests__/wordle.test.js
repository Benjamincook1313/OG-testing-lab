import { jest } from "@jest/globals";

const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule("../src/words.js", () => {
  return {
    getWord: jest.fn(() => "APPLE"),
    isWord: mockIsWord
  };
});

const { Wordle, buildLetter } = await import('../src/wordle.js');


describe("building a litter obj", () => {
  test("return a letter obj", () => {
    const ltr = "B";
    expect(buildLetter(ltr, "PRESENT")).toEqual({letter: ltr, status: "PRESENT"});
  });
});

describe("Creating a new wordle game", () => {
  it("Default maxGuesses to 6 if nothing is passed in", () => {
    expect(new Wordle().maxGuesses).toBe(6);
  });

  it("maxGuesses prop is set to the value passed in", () => {
    expect(new Wordle(10).maxGuesses).toBe(10);
  });

  it("guesses arr is the length that is passed in", () => {
    expect(new Wordle(7).guesses.length).toBe(7);
  });

  it("currGuess prop is set to 0", () => {
    expect(new Wordle(5).currGuess).toBe(0);
  });

  test("sets word prop to APPLE", () => {
    let wordle = new Wordle();
    expect(wordle.word).toBe("APPLE");
  });
});

describe("Build a guess arr from a string", () => {
  it("check it guess is in the correct location", () => {
    const wordle = new Wordle(5);
    const guess = wordle.buildGuessFromWord("A____");
    expect(guess[0].status).toBe("CORRECT");
  });

  it("Checks if words in included in the array", () => {
    const wordle = new Wordle(5);
    const guess = wordle.buildGuessFromWord("E____");
    expect(guess[0].status).toBe("PRESENT");
  });

  it("Checks if words in included in the array", () => {
    const wordle = new Wordle(5);
    const guess = wordle.buildGuessFromWord("Z____");
    expect(guess[0].status).toBe("ABSENT");
  });

  it("Throws an error if max guesses has been reached", () => {
    const wordle = new Wordle(1);
    wordle.appendGuess("C____");
    expect(() => wordle.appendGuess("A____")).toThrow();
  });

  it("Throws Error if guess is longer than 5 chars", () => {
    const wordle = new Wordle(1);
    expect(() => {
      wordle.appendGuess("CHERRY").toThrow();
    })
  });

  it("Throws Error if guess is not a word", () => {
    const wordle = new Wordle(1);
    mockIsWord.mockReturnValueOnce(false);
    expect(() => wordle.appendGuess("GUESS")).toThrow();
  });

  it("increments the current guess", () => {
    const wordle = new Wordle(3);
    wordle.appendGuess("GUESS");
    expect(wordle.currGuess).toBe(1);
  });

  describe("isSolved", () => {
    it("Checks if the latest guess is correct", () => {
      const wordle = new Wordle(1);
      wordle.appendGuess("APPLE");
      expect(wordle.isSolved()).toBeTruthy();
    });

    it("Checks if the latest guess is not correct", () => {
      const wordle = new Wordle(1);
      wordle.appendGuess("GUESS");
      expect(wordle.isSolved()).toBeFalsy();
    });
  })

  describe("shouldEndGame", () => {
    it("returns true if latest guess is correct", () => {
      const wordle = new Wordle();
      wordle.appendGuess("APPLE");
      expect(wordle.shouldEndGame()).toBeTruthy();
    });

    it("returns true if latest guess is correct", () => {
      const wordle = new Wordle(1);
      wordle.appendGuess("GUESS");
      expect(wordle.shouldEndGame()).toBeTruthy();
    });

    it("returns false if no guess has been made", () => {
      const wordle = new Wordle(1);
      expect(wordle.shouldEndGame()).toBeFalsy();
    });

    it("returns false if there are guesses remaining", () => {
      const wordle = new Wordle(2);
      wordle.appendGuess("HELLO")
      expect(wordle.shouldEndGame()).toBeFalsy();
    });
  })

});