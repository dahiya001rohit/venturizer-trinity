require('dotenv').config()
const { pool } = require('./pool')
const { processLead } = require('../queue')

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log("Fetching ALL leads to rescore organically via the AI pipeline...");
  const { rows } = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
  
  console.log(`Found ${rows.length} leads. Processing sequentially to respect rate limits...`);
  
  for (let i = 0; i < rows.length; i++) {
    const lead = rows[i];
    console.log(`\n[${i+1}/${rows.length}] Rescoring lead: ${lead.name || lead.id} (${lead.type})`);
    
    try {
      // We pass the entire lead object to processLead
      // Wait, processLead usually takes the db id and queries it, let's just use processLead
      await pool.query("UPDATE leads SET score_status = 'provisional' WHERE id = $1", [lead.id]);
      
      const success = await processLead(lead.id);
      
      if (success) {
        // Fetch new score
        const { rows: updatedRows } = await pool.query('SELECT score, bucket FROM leads WHERE id = $1', [lead.id]);
        if (updatedRows.length > 0) {
          console.log(`✅ Success! New score: ${updatedRows[0].score}, Bucket: ${updatedRows[0].bucket}`);
        }
      } else {
        console.log(`❌ Failed to process lead ${lead.id}`);
      }
      
      // Wait 4 seconds between requests to completely avoid rate limiting
      console.log("Waiting 4s...");
      await sleep(4000);
    } catch (e) {
      console.error("Error processing lead:", e);
    }
  }

  console.log("\nAll leads have been organically rescored using the updated Groq AI prompt!");
  process.exit(0);
}

run().catch(console.error);
