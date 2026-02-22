console.log("TEST START");
import { loadEnvFile } from 'node:process';
console.log("PROCESS IMPORTED");
loadEnvFile('.env');
console.log("ENV LOADED");
import { Orchestrator } from '../lib/agents/orchestrator';
console.log("ORCHESTRATOR IMPORTED");

async function run() {
    console.log("RUNNING");
    const orch = new Orchestrator();
    console.log("ORCHESTRATOR CREATED");
    const res = await orch.transform("Paris trip");
    console.log("RESULT:", JSON.stringify(res, null, 2));
}

run().catch(console.error);
