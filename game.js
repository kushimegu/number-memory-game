import process from "node:process";
import pkg from "enquirer";

import { Utils } from "./utils.js";
import { ForwardStage } from "./forward_stage.js";
import { BackwardStage } from "./backward_stage.js";

export class Game {
  constructor() {
    this.stage = null;
  }

  async selectStage() {
    const { Select } = pkg;
    const prompt = new Select({
      message: "Pick a stage",
      choices: ["Forward", "Backward"],
    });
    return await prompt.run();
  }

  async selectLevel() {
    const { Select } = pkg;
    const prompt = new Select({
      message: "Pick a number of digits you want to start with",
      choices: ["3", "4", "5"],
    });
    return await prompt.run();
  }

  async displayNumbers(digits) {
    let numbers = Utils.generateRandomNumbers(digits);
    console.log(numbers);
    for (let i = 0; i < digits; i++) {
      let number = numbers[i];
      process.stdout.write(number.toString());
      await Utils.clearLineAfterDelay(1000);
      await Utils.delay(500);
    }
    return numbers;
  }

  async receiveAnswer() {
    const { prompt } = pkg;
    const response = await prompt({
      type: "input",
      name: "answer",
      message: "Answer?",
    });
    return response;
  }

  async start() {
    console.log(
      "Starting from the number of digits you chose, digits will be shown for 1 seconds each.\nAnswer the number in order for Forward Stage, in reverse order for Backward Stage."
    );

    const selectedStage = await this.selectStage();
    this.stage =
      selectedStage === "Forward" ? new ForwardStage() : new BackwardStage();
    const digits = parseInt(await this.selectLevel());
    let i;
    for (i = digits; i < 10; i++) {
      await Utils.countDown();
      const numbers = await this.displayNumbers(i);
      const answer = await this.receiveAnswer();
      const correct = await this.stage.judgeAnswer(numbers, answer);
      if (correct === false) {
        this.stage.displayCorrectAnswer(numbers);
        break;
      }
      if (i < 9) {
        await Utils.delay(500);
        process.stdout.write("Next");
        await Utils.clearLineAfterDelay(1000);
      }
    }
    console.log(`Your rank is ${this.stage.ranking(i - 1)}`);
  }
}
