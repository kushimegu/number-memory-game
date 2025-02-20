import readline from "node:readline";
import process from "node:process";
import enquirer from "enquirer";

import ForwardStage from "./forward_stage.js";
import BackwardStage from "./backward_stage.js";

export default class Game {
  #stage;

  constructor() {
    this.#stage = null;
  }

  async start() {
    console.log(`Starting from the level (number of digits) you choose, digits will be shown for 1 seconds each.
Answer the number in order for Forward Stage, in reverse order for Backward Stage.
Answer correctly and you can challenge the next level until you fail twice or reach the last level with 9 digits.
Your rank will be shown after you finish the game.`);
    const selectedStage = await this.#selectStage();
    this.#stage =
      selectedStage === "Forward" ? new ForwardStage() : new BackwardStage();
    const digits = parseInt(await this.#selectLevel());
    let i;
    let failureCount = 0;
    level: for (i = digits; i < 10; i++) {
      for (let j = 1; j < 3; j++) {
        await this.#countDown();
        const numbers = await this.#displayNumbers(i);
        const response = await this.#receiveAnswer();
        const correct = await this.#stage.judgeAnswer(numbers, response);
        if (correct === false) {
          this.#stage.displayCorrectAnswer(numbers);
          failureCount += 1;
          if (failureCount === 1) {
            console.log("One more chance remaining.");
            const tryAgain = await this.#selectToTryAgain();
            if (tryAgain === "No") {
              break level;
            }
          } else if (failureCount === 2) {
            break level;
          }
        } else {
          break;
        }
      }
      if (i < 9) {
        if (failureCount === 1) {
          console.log("One more chance remaining.");
        }
        const turnToNextLevel = await this.#selectToChallenge();
        if (turnToNextLevel === "No") {
          break;
        }
      }
    }
    console.log(`Your rank is ${this.#getRank(i - 1)}.`);
  }

  async #selectStage() {
    const prompt = new enquirer.Select({
      message: "Pick a stage",
      choices: ["Forward", "Backward"],
    });
    return await prompt.run();
  }

  async #selectLevel() {
    const prompt = new enquirer.Select({
      message: "Pick a number of digits to start with",
      choices: ["4", "5", "6"],
    });
    return await prompt.run();
  }

  #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async #clearLineAfterDelay(ms) {
    await this.#delay(ms);
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
  }

  async #countDown() {
    await this.#delay(500);
    process.stdout.write("Ready");
    await this.#clearLineAfterDelay(1000);
    await this.#delay(500);
    process.stdout.write("Start");
    await this.#clearLineAfterDelay(1000);
    await this.#delay(500);
  }

  #generateRandomNumbers(length) {
    let numbers = [];
    for (let i = 1; i < length + 1; i++) {
      numbers.push(Math.floor(Math.random() * 9));
    }
    return numbers;
  }

  async #displayNumbers(digits) {
    let numbers = this.#generateRandomNumbers(digits);
    for (let i = 0; i < digits; i++) {
      let number = numbers[i];
      process.stdout.write(number.toString());
      await this.#clearLineAfterDelay(1000);
      await this.#delay(500);
    }
    return numbers;
  }

  async #receiveAnswer() {
    const response = await enquirer.prompt({
      type: "input",
      name: "answer",
      message: "Answer?",
    });
    return response;
  }

  async #selectToTryAgain() {
    const prompt = new enquirer.Select({
      message: "Try the same level again?",
      choices: ["Yes", "No"],
    });
    return await prompt.run();
  }

  async #selectToChallenge() {
    const prompt = new enquirer.Select({
      message: "Challenge the next level?",
      choices: ["Yes", "No"],
    });
    return await prompt.run();
  }

  #getRank(digits) {
    const ranks = { 5: "C", 6: "B", 7: "A", 8: "S", 9: "SS" };
    return ranks[digits] || "D";
  }
}
