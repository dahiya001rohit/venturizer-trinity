require('dotenv').config()
const { pool } = require('./pool')
const { processLead } = require('../queue')

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Fetching only PROVISIONAL leads to rescore organically via the AI pipeline...");
  const { rows } = await pool.query("SELECT * FROM leads WHERE score_status = 'provisional' ORDER BY created_at DESC");
  
  console.log(`Found ${rows.length} provisional leads. Processing sequentially to respect rate limits...`);
  
  for (let i = 0; i < rows.length; i++) {
    const lead = rows[i];
    console.log(`\n[${i+1}/${rows.length}] Rescoring provisional lead: ${lead.name || lead.id} (${lead.type})`);
    
    try {
      const success = await processLead({ leadId: lead.id, transcript: { type: lead.type, answers: lead.answers }, junkFields: [] });
      
      // Fetch new score
      const { rows: updatedRows } = await pool.query('SELECT score, bucket, score_status FROM leads WHERE id = $1', [lead.id]);
      if (updatedRows.length > 0) {
        console.log(`✅ Success! New score: ${updatedRows[0].score}, Bucket: ${updatedRows[0].bucket}, Status: ${updatedRows[0].score_status}`);
      }
      
      // Wait 6 seconds between requests to completely avoid rate limiting
      console.log("Waiting 6s...");
      await sleep(6000);
    } catch (e) {
      console.error("Error processing lead:", e);
    }
  }

  console.log("\nAll provisional leads have been organically rescored using the AI pipeline!");
  process.exit(0);
}

run().catch(console.error);
