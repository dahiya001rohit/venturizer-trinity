const { processLead } = require('./queue');
const { pool } = require('./db/pool');

async function test() {
  const res = await pool.query("SELECT * FROM leads WHERE id = 'bc95ba2b-9c97-44e6-9d22-804ad499e9b0'");
  const lead = res.rows[0];
  try {
    await processLead({
      leadId: lead.id,
      transcript: { type: lead.type, answers: lead.answers },
      junkFields: []
    });
    console.log("Success!");
  } catch(e) {
    console.error("CRASHED:", e);
  }
  process.exit(0);
}
test();
