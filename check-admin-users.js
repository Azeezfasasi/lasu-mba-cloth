import User from "./src/app/server/models/User.js";
import { connectDB } from "./src/app/server/db/connect.js";

async function checkAdmins() {
  try {
    await connectDB();
    console.log("\n🔍 Checking admin users in database...\n");

    // Check all roles in database
    const allUsers = await User.find({}).select("email firstName lastName role");
    console.log("📋 All users in database:");
    allUsers.forEach((user) => {
      console.log(`  - ${user.email} (Role: "${user.role}", Name: ${user.firstName} ${user.lastName})`);
    });

    console.log("\n");

    // Check admins specifically
    const admins = await User.find({ role: "admin" }).select("email firstName lastName role");
    console.log(`✅ Admins found with role="admin": ${admins.length}`);
    admins.forEach((admin) => {
      console.log(`  - ${admin.email} (${admin.firstName} ${admin.lastName})`);
    });

    console.log("\n");

    // Check for other role variants
    const staffMembers = await User.find({ role: "staff-member" }).select("email firstName lastName role");
    console.log(`📌 Staff members found: ${staffMembers.length}`);
    staffMembers.forEach((staff) => {
      console.log(`  - ${staff.email} (${staff.firstName} ${staff.lastName})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkAdmins();
