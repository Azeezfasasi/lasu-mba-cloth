import mongoose from "mongoose";
import { connectDB } from "./src/app/server/db/connect.js";

async function dropOldIndexes() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("volunteers");

    console.log("\n📋 Current indexes:");
    const indexes = await collection.getIndexes();
    console.log(indexes);

    // Drop the old studentId_1 index if it exists
    if (indexes.studentId_1) {
      await collection.dropIndex("studentId_1");
      console.log("\n✅ Dropped old studentId_1 index");
    } else {
      console.log("\n⚠️ studentId_1 index not found (may have already been dropped)");
    }

    // Check if there are any other problematic indexes
    const indexNames = Object.keys(indexes);
    console.log("\n📊 Remaining indexes:", indexNames);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

dropOldIndexes();
