import readline from "node:readline";
import process from "node:process";
import pkg from "enquirer";

import { ForwardStage } from "./forward_stage.js";
import { BackwardStage } from "./backward_stage.js";

export class Game {
  constructor() {
    this.stage = null;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async clearLineAfterDelay(ms) {
    await this.delay(ms);
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
  }

  async countDown() {
    await this.delay(500);
    process.stdout.write("Ready");
    await this.clearLineAfterDelay(1000);
    await this.delay(500);
    process.stdout.write("Start");
    await this.clearLineAfterDelay(1000);
    await this.delay(500);
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
      message: "Pick a number of digits to start with",
      choices: ["3", "4", "5"],
    });
    return await prompt.run();
  }

  generateRandomNumbers(length) {
    let numbers = [];
    for (let i = 1; i < length + 1; i++) {
      numbers.push(Math.floor(Math.random() * 9));
    }
    return numbers;
  }

  async displayNumbers(digits) {
    let numbers = this.generateRandomNumbers(digits);
    console.log(numbers);
    for (let i = 0; i < digits; i++) {
      let number = numbers[i];
      process.stdout.write(number.toString());
      await this.clearLineAfterDelay(1000);
      await this.delay(500);
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

  async selectToChallenge() {
    const { Select } = pkg;
    const prompt = new Select({
      message: "Challenge the next level?",
      choices: ["Yes", "No"],
    });
    return await prompt.run();
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

  async start() {
    console.log(`Starting from the level (number of digits) you choose, digits will be shown for 1 seconds each.
Answer the number in order for Forward Stage, in reverse order for Backward Stage.
Answer correctly and you can challenge the next level until the last level with 9 digits. Good luck!`);
    const selectedStage = await this.selectStage();
    this.stage =
      selectedStage === "Forward" ? new ForwardStage() : new BackwardStage();
    const digits = parseInt(await this.selectLevel());
    let i;
    for (i = digits; i < 10; i++) {
      await this.countDown();
      const numbers = await this.displayNumbers(i);
      const answer = await this.receiveAnswer();
      const correct = await this.stage.judgeAnswer(numbers, answer);
      if (correct === false) {
        this.stage.displayCorrectAnswer(numbers);
        break;
      }
      if (i < 9) {
        const turnToNextLevel = await this.selectToChallenge();
        if (turnToNextLevel === "No") {
          break;
        }
      }
    }
    console.log(`Your rank is ${this.ranking(i - 1)}`);
  }
}
