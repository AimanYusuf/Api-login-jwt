import mongoose from "mongoose";

const databseConn = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log(`Database connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default databseConn;
