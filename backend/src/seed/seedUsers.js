import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import { connectDB } from "../config/db.js";
const seedUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany({ email: { $in: ["demo@test.com", "admin@test.com"] } });
    console.log("🗑️  Removed existing test users (if any)");
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@test.com",
      password: "demo123",
      role: "user"
    });
    console.log("✅ Demo user created: demo@test.com / demo123");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "admin123",
      role: "admin"
    });
    console.log("✅ Admin user created: admin@test.com / admin123");
    const demoMatch = await demoUser.matchPassword("demo123");
    const adminMatch = await adminUser.matchPassword("admin123");
    if (demoMatch && adminMatch) {
      console.log("✅ Password verification successful");
    } else {
      console.log("⚠️  Warning: Password verification failed");
    }
    console.log("\n📝 Test Credentials:");
    console.log("User: demo@test.com / demo123");
    console.log("Admin: admin@test.com / admin123");
    console.log("\n✅ Users seeded successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};
seedUsers();