export class ForwardStage{
  async judgeAnswer(numbers, answer) {
    if (numbers.join("") === answer.answer) {
      console.log("Correct!");
      return true;
    } else {
      console.log("Incorrect");
      return false;
    }
  }

  displayCorrectAnswer(numbers) {
    console.log(`The answer was ${numbers.join("")}`);
  }

  ranking(digits) {
    let rank;
    if (digits < 5) {
      rank = "D";
    } else if (digits === 5) {
      rank = "C";
    } else if (digits === 6) {
      rank = "B";
    } else if (digits === 7) {
      rank = "A";
    } else if (digits === 8) {
      rank = "S";
    } else if (digits === 9) {
      rank = "SS";
    }
    return rank;
  }
}
