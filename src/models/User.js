import { Schema, model } from "mongoose";

const userSchema = new Schema({
    wallet: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default model('User', userSchema)