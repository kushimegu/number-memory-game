import process from "node:process"

export default class BackwardStage {
  async judgeAnswer(numbers, response) {
    if (numbers.toReversed().join("") === response.answer) {
      process.stdout.write("Correct! ");
      return true;
    } else {
      process.stdout.write("Incorrect. ");
      return false;
    }
  }

  displayCorrectAnswer(numbers) {
    console.log(`The answer was ${numbers.toReversed().join("")}`);
  }
}
