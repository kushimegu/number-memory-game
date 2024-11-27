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
    const selectedStage = await this.selectStage();
    this.stage =
      selectedStage === "Forward" ? new ForwardStage() : new BackwardStage();
    let i;
    for (i = 4; i < 10; i++) {
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
    if (i === 4) {
      console.log(
        `You couldn't remember order of 4 numbers. Your rank is ${this.stage.ranking(
          i
        )}`
      );
    } else {
      console.log(
        `You remembered order of ${
          i - 1
        } numbers! Your rank is ${this.stage.ranking(i - 1)}`
      );
    }
  }
}
