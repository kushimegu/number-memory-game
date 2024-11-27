export class BackwardStage {
  async judgeAnswer(numbers, answer) {
    if (numbers.toReversed().join("") === answer.answer) {
      console.log("Correct!");
      return true;
    } else {
      console.log("Incorrect");
      return false;
    }
  }

  displayCorrectAnswer(numbers) {
    console.log(numbers)
    console.log(`The answer was ${numbers.toReversed().join("")}`);
  }

  ranking(digits) {
    let rank;
    if (digits < 4) {
      rank = "D";
    } else if (digits === 4) {
      rank = "C";
    } else if (digits === 5) {
      rank = "B";
    } else if (digits === 6) {
      rank = "A";
    } else if (digits === 7) {
      rank = "S";
    } else if (digits === 8) {
      rank = "SS";
    } else if (digits === 9) {
      rank = "SSS";
    }
    return rank;
  }
}
