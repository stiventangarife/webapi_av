import { validate } from "graphql";
import { Schema, model } from "mongoose";

const axiesUserSchema = new Schema({
    axieId: {
        type: String,
        unique: true,
        required: true
    },
    axieName: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
        min: [1,],
        max: [30]
    },
    maxHealth: {
        type: Number,
        required: true
    },
    currentHealth: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value <= this.maxHealth;
            }
        }
    },
    maxEnergy: {
        type: Number,
        required: true
    },
    currentEnergy: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value <= this.maxEnergy;
            }
        }
    },
    initiative: {
        type: Number,
        required: true,
        min: [0]
    },
    attack: {
        type: Number,
        required: true,
        min: [0]
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

export default model('AxiesUser', axiesUserSchema)