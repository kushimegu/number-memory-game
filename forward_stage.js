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
}
