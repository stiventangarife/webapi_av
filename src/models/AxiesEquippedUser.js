import { validate } from "graphql";
import { Schema, model } from "mongoose";

const axiesEquippedUserSchema = new Schema({
    slot: {
        type: Number,
        required: true
    },
    idAxie: {
        type: Schema.Types.ObjectId,
        ref: "AxieUser",
        required: false
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

axiesEquippedUserSchema.index({ idUser: 1, slot: 1 }, { unique: true });

export default model('AxiesEquippedUser', axiesEquippedUserSchema)