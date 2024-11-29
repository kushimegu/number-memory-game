import process from "node:process"

export class ForwardStage{
  async judgeAnswer(numbers, answer) {
    if (numbers.join("") === answer.answer) {
      process.stdout.write("Correct! ");
      return true;
    } else {
      process.stdout.write("Incorrect. ");
      return false;
    }
  }

  displayCorrectAnswer(numbers) {
    console.log(`The answer was ${numbers.join("")}`);
  }
}
