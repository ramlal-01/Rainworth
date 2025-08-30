import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not set in your .env file");
      process.exit(1);
    }

    // Use mongoose.connect with options
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB Atlas connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    if (error.message.includes("Client network socket disconnected")) {
      console.error(
        "⚠️  This usually happens when your IP is not whitelisted in MongoDB Atlas or there is a network issue."
      );
      console.error(
        "Go to https://www.mongodb.com/docs/atlas/security-whitelist/ and add your current IP or 0.0.0.0/0 for testing."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
