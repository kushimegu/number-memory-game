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
}
