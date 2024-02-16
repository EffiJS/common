#!/usr/bin/env node
const { createService } = require('./module');

async function run() {
  const cmd = process.argv[2];
  switch (cmd) {
    case 's':
      const serviceName = process.argv[3];
      await createService(serviceName);
      console.log(`Service '${serviceName}' was successfully created.`);
      break;
  }
}

run();
