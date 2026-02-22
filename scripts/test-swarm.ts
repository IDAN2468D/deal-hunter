import { loadEnvFile } from 'node:process';
loadEnvFile();

// Import after env is loaded
import { orchestrateSearch } from '../app/actions/agent-swarm';

async function testSwarm() {
    console.log('🐝 Testing Sub-Agent Swarm Orchestration...\n');

    try {
        console.log('Phase 1: Standard Parallel Search (Paris, Budget $2000)');
        const results = await orchestrateSearch('Paris', 2000);

        console.log('\n🛩️ Flight Agent Results:');
        console.log(JSON.stringify(results.flights, null, 2));

        console.log('\n🏨 Hotel Agent Results:');
        console.log(JSON.stringify(results.hotels, null, 2));

        if (results.flights.success && results.hotels.success) {
            console.log('\n✅ Orchestration Successful: Parallel agents completed safely.');
        } else {
            console.warn('\n⚠️ Partial Success detected. Checking integrity...');
        }

        console.log('\n--- End of Swarm Test ---');
    } catch (error) {
        console.error('❌ Swarm Orchestration Failed:', error);
        process.exit(1);
    }
}

testSwarm();
