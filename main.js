import readline from "node:readline";
import process from "node:process";
import pkg from "enquirer";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clearLineAfterDelay(ms) {
  await delay(ms);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
}
// npxしたら説明文を入れる

// 順番・逆順から選択
async function selectStage() {
  const { Select } = pkg;
  const prompt = new Select({
    message: "Pick a stage",
    choices: ["Order", "Reverse Order"],
  });
  return await prompt.run();
}

// Ready, Startを表示
async function countDown() {
  await delay(500)
  process.stdout.write("Ready");
  await clearLineAfterDelay(1000);
  await delay(500);
  process.stdout.write("Start");
  await clearLineAfterDelay(1000);
  await delay(500);
}

// そのステージの桁数の数字を生成
function createRandomNumber(times) {
  let numbers = [];
  for (let i = 1; i < times + 1; i++) {
    numbers.push(Math.floor(Math.random() * 9));
  }
  return numbers;
}

// 数字の表示
async function displayNumbers(digits) {
  let numbers = createRandomNumber(digits);
  console.log(numbers);
  for (let i = 0; i < digits; i++) {
    let number = numbers[i];
    process.stdout.write(number.toString());
    await clearLineAfterDelay(1000);
    await delay(500);
  }
  return numbers;
}

// 入力を受け付ける
async function receiveAnswer() {
  const { prompt } = pkg;
  const response = await prompt({
    type: "input",
    name: "answer",
    message: "Answer?",
  });
  return response;
}

// 正誤判定
async function judgeAnswer(numbers, answer) {
  if (numbers.join("") === answer.answer) {
    console.log("Correct!");
    return true;
  } else {
    console.log("Wrong");
    return false;
  }
}
// 正誤判定で2回間違えたら終了
// async function judgeContinue(judgement) {
//   if (judgement === false) {
//     console.log("Finished");
//     ;
//   }
// }

// ランク付け
function ranking(digits) {
  let rank;
  if (digits === 4) {
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

async function execute() {
  await selectStage();
  let i;
  for (i = 4; i < 10; i++) {
    await countDown();
    const numbers = await displayNumbers(i);
    const answer = await receiveAnswer();
    const correct = await judgeAnswer(numbers, answer);
    if (correct === false) {
      break;
    }
    await delay(500);
    process.stdout.write("Next");
    await clearLineAfterDelay(1000);
  }
  if (i === 4) {
    console.log(
      `You couldn't remember order of 4 numbers. Your rank is ${ranking(i)}`
    );
  } else {
    console.log(
      `You remembered order of ${i - 1} numbers! Your rank is ${ranking(i)}`
    );
  }
}

await execute();
