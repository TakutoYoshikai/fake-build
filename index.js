const request = require("request");
const cliProgress = require("cli-progress");

function print(str) {
  process.stdout.write(str);
}

function progress(bar, value, speed) {
  if (speed === undefined) {
    speed = 800;
  }
  const i = Math.floor(Math.random() * speed);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      bar.update(value);
      resolve();
    }, Math.floor(Math.random() * (speed / 8)) + i);
  });
}

async function runTask(title, speed) {
  console.log(title);
  const bar = new cliProgress.SingleBar({
    barCompleteChar: "#",
    barIncompleteChar: " ",
    hideCursor: true
  }, cliProgress.Presets.shades_classic);
  bar.start(30, 0);
  for (let i = 0; i <= 30; i++) {
    await progress(bar, i, speed);
  }
  bar.stop();
}

async function runTasks(tasks) {
  for (const task of tasks) {
    const speed = Math.floor(Math.random() * 800);
    await runTask(task, speed);
  }
}

function getRepositories(owner) {
  return new Promise((resolve, reject) => {
    const options = {
      url: "https://api.github.com/users/" + owner + "/repos",
      method: "GET",
      headers: {
        "user-agent": "node.js"
      }
    };
    request(options, (err, response, body) => {
      const json = JSON.parse(body);
      const repos = json.map(repo => {
        return repo.full_name;
      });
      resolve(repos);
    });
  });
}

async function fakeInstall(owner) {
  const repos = await getRepositories(owner);
  for (const repo of repos) {
    const speed = Math.floor(Math.random() * 800);
    await runTask("Downloading " + repo, speed);
  }
  for (const repo of repos) {
    const speed = Math.floor(Math.random() * 800);
    await runTask("Building " + repo, speed);
  }
  for (const repo of repos) {
    const speed = Math.floor(Math.random() * 800);
    await runTask("Installing " + repo, speed);
  }
}

module.exports = fakeInstall;
