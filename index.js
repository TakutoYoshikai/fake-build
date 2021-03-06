const request = require("request");

function print(str) {
  process.stdout.write(str);
}

function progress() {
  const i = Math.floor(Math.random() * 1000);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      print("#");
      resolve();
    }, Math.floor(Math.random() * 100) + i);
  });
}

async function oneTask(title) {
  print(title + ": [");
  for (let i = 0; i < 30; i++) {
    await progress();
  }
  print("]    Done!!!\n");
}

async function runTasks(tasks) {
  for (const task of tasks) {
    await oneTask(task);
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
    await oneTask("Downloading " + repo);
  }
  for (const repo of repos) {
    await oneTask("Building " + repo);
  }
  for (const repo of repos) {
    await oneTask("Installing " + repo);
  }
}

module.exports = fakeInstall;
