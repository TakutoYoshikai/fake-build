const request = require("request");

function print(str) {
  process.stdout.write(str);
}

function progress(speed) {
  if (speed === undefined) {
    speed = 800;
  }
  const i = Math.floor(Math.random() * speed);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      print("#");
      resolve();
    }, Math.floor(Math.random() * (speed / 8)) + i);
  });
}

async function runTask(title, speed) {
  print(title + ": [");
  for (let i = 0; i < 30; i++) {
    await progress(speed);
  }
  print("]    Done!!!\n");
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
