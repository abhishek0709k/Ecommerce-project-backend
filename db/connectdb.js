import mongoose from "mongoose";

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("MongoDB connected successfully")
    })
}

export default connectDB;