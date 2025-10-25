import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

export async function connect()
{
    try
    {
        await mongoose.connect(uri, {
            useNewUrlParser: true
        })
        
        console.log('>>> DB is connect');
    }
    catch(error)
    {
        console.log('Error DB connection '+error);
    }
    
}
