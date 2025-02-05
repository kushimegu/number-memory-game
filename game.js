import readline from "node:readline";
import process from "node:process";
import enquirer from "enquirer";

import { ForwardStage } from "./forward_stage.js";
import { BackwardStage } from "./backward_stage.js";

export default class Game {
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
    const prompt = new enquirer.Select({
      message: "Pick a stage",
      choices: ["Forward", "Backward"],
    });
    return await prompt.run();
  }

  async selectLevel() {
    const prompt = new enquirer.Select({
      message: "Pick a number of digits to start with",
      choices: ["4", "5", "6"],
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
    // console.log(numbers);
    for (let i = 0; i < digits; i++) {
      let number = numbers[i];
      process.stdout.write(number.toString());
      await this.clearLineAfterDelay(1000);
      await this.delay(500);
    }
    return numbers;
  }

  async receiveAnswer() {
    const response = await enquirer.prompt({
      type: "input",
      name: "answer",
      message: "Answer?",
    });
    return response;
  }

  async selectToTryAgain() {
    const prompt = new enquirer.Select({
      message: "Try the same level again?",
      choices: ["Yes", "No"],
    });
    return await prompt.run();
  }

  async selectToChallenge() {
    const prompt = new enquirer.Select({
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
Answer correctly and you can challenge the next level until you fail twice or reach the last level with 9 digits.`);
    const selectedStage = await this.selectStage();
    this.stage =
      selectedStage === "Forward" ? new ForwardStage() : new BackwardStage();
    const digits = parseInt(await this.selectLevel());
    let i;
    let countFailure = 0;
    level: for (i = digits; i < 10; i++) {
      for (let j = 1; j < 3; j++) {
        await this.countDown();
        const numbers = await this.displayNumbers(i);
        const answer = await this.receiveAnswer();
        const correct = await this.stage.judgeAnswer(numbers, answer);
        if (correct === false) {
          this.stage.displayCorrectAnswer(numbers);
          countFailure += 1;
          if (countFailure === 1) {
            console.log("One more chance remaining.");
            const tryAgain = await this.selectToTryAgain();
            if (tryAgain === "No") {
              break level;
            }
          } else if (countFailure === 2) {
            break level;
          }
        } else {
          break;
        }
      }
      if (i < 9) {
        if (countFailure === 0) {
          console.log("Two more chances remaining.");
        } else {
          console.log("One more chance remaining.");
        }
        const turnToNextLevel = await this.selectToChallenge();
        if (turnToNextLevel === "No") {
          break;
        }
      }
    }
    console.log(`Your rank is ${this.ranking(i - 1)}.`);
  }
}
