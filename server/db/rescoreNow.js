require('dotenv').config();
const { getProvisionalLeads } = require("./leads.repo");
const { processLead } = require("../queue");
const { pool } = require("./pool");

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const leads = await getProvisionalLeads();
  console.log(`Found ${leads.length} provisional leads. Attempting rescore...`);
  
  for (const lead of leads) {
    console.log(`Processing lead ${lead.id}...`);
    await processLead({ 
      leadId: lead.id, 
      transcript: { type: lead.type, answers: lead.answers },
      junkFields: [] 
    }, "rescoreLead");
    
    // Sleep to avoid Groq rate limits
    console.log("Sleeping for 3 seconds to respect rate limits...");
    await sleep(3000);
  }
  
  console.log("Finished rescoring.");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
