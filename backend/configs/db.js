import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "RxCare" });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
