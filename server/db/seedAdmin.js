require("dotenv").config();
const bcrypt = require("bcrypt");
const { query } = require("./pool");
const fs = require("fs");
const path = require("path");

async function seedAdmin() {
  try {
    // 1. Run the schema migrations to ensure admins table exists
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    console.log("Applying schema...");
    await query(schema);
    
    // 2. Hash the default password
    const email = "team@venturizer.com";
    const plainTextPassword = "reviewer123";
    console.log(`Hashing password for ${email}...`);
    const hash = await bcrypt.hash(plainTextPassword, 10);

    // 3. Insert or update the admin record
    console.log("Inserting admin record...");
    await query(`
      INSERT INTO admins (email, password_hash) 
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, [email, hash]);

    console.log("Admin seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exit(1);
  }
}

seedAdmin();
