const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://pradeepbhangi:wVabxnUldvxkHXlv@cluster0.1wxpsay.mongodb.net/";

  try {
    const connect = await mongoose.connect(mongoUri);

    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
