import readline from "node:readline";
import process from "node:process";

export class Utils {
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async clearLineAfterDelay(ms) {
    await this.delay(ms);
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 0);
  }

  static async countDown(){
    await this.delay(500);
    process.stdout.write("Ready");
    await this.clearLineAfterDelay(1000);
    await this.delay(500);
    process.stdout.write("Start");
    await this.clearLineAfterDelay(1000);
    await this.delay(500);
  }

  static generateRandomNumbers(length) {
    let numbers = [];
    for (let i = 1; i < length + 1; i++) {
      numbers.push(Math.floor(Math.random() * 9));
    }
    return numbers;
  }
}
