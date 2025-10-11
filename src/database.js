import mongoose from "mongoose";

const uri = "mongodb+srv://tangarifedev_db_user:jVqxfu4DJxSMPyc3@axie-adventures-test.rbrmaj9.mongodb.net/?retryWrites=true&w=majority&appName=axie-adventures-test";

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
