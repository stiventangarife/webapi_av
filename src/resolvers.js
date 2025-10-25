import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./models/User.js";
import AxiesUser from "./models/AxiesUser.js";
import AxiesEquippedUser from "./models/AxiesEquippedUser.js";

const SECRET = "supersecretkey";

export const resolvers = {
    Query: {
        users: async () => {
            return await User.find();
        },
        userByWallet: async (_, { wallet }) => {
            return await User.findOne({ wallet });
        }, 
        axiesByUser: async (_, { idUser }, { userToken }) => {
            /*if(!userToken)
            {
                throw new Error("Unauthorized");
            }*/
            
            return await AxiesUser.find({ idUser });
        }
    },
    Mutation: {
        //USERS
        createUser: async (_, { input }) => {
            const existingUser = await User.findOne( { wallet: input.wallet });
            if(existingUser)
            {
                throw new Error("Wallet already registeres")
            }

            const hashedPassword = await bcrypt.hash(input.password, 10);

            const newUser = new User({ wallet: input.wallet, password: hashedPassword });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id, wallet: newUser.wallet }, SECRET, { expiresIn: "1d"});

            return { token };
        },
        loginUser: async (_, { input }) => {
            const user = await User.findOne({ wallet: input.wallet });
            if(!user)
            {
                throw new Error("Wallet does not exist")
            }

            const valid = await bcrypt.compare( input.password, user.password);
            if(!valid)
            {
                throw new Error("Incorrect password")
            }

            const token = jwt.sign({ id: user._id, wallet: user.wallet}, SECRET, { expiresIn: "1d"});

            return { token, user };
        },

        //AXIES
        createAxieUser: async (_, { input }, { userToken }) => {
            if(!userToken)
            {
                throw new Error("Unauthorized");
            }

            const newAxieUser = new AxiesUser(input);
            await newAxieUser.save();
            return newAxieUser;
        },
        /*deleteAxieUser: async (_, { _id }, { userToken }) => {
            if(!userToken)
            {
                throw new Error("Unauthorized");
            }

            return await AxiesUser.findByIdAndDelete(_id);
        },*/
        updateAxieUser: async (_, { _id, input }, { userToken }) => {
            if(!userToken)
            {
                throw new Error("Unauthorized");
            }

            return await AxiesUser.findByIdAndUpdate(_id, input, { new: true });
        },

        //AXIES EQUIPO
        createAxiesEquippedUser: async (_, { _id, input }, { userToken }) => {
            /*if(!userToken)
            {
                throw new Error("Unauthorized");
            }*/

            const newAxieEquippedUser = new AxiesEquippedUser(input);
            await newAxieEquippedUser.save();
            return newAxieEquippedUser;
        }
    }
};