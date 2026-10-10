const mongoose = require("mongoose");
const User = require("./models/user");

const MONGO_URI = "mongodb://127.0.0.1:27017/pageturner";

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected Successfully!");

    const existingAdmin = await User.findOne({
      email: "admin@pageturner.com",
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      console.log(existingAdmin);
      process.exit(0);
    }

    const admin = new User({
      name: "admin",
      email: "admin@pageturner.com",
      password: "admin123",
      role: "admin",
    });

    await admin.save();

    console.log("");
    console.log("================================");
    console.log("NEW ADMIN CREATED SUCCESSFULLY");
    console.log("Name: admin");
    console.log("Email: admin@pageturner.com");
    console.log("Password: admin123");
    console.log("Role: admin");
    console.log("================================");

    await mongoose.connection.close();
  } catch (error) {
    console.error("ERROR:", error);
    await mongoose.connection.close();
  }
}

createAdmin();