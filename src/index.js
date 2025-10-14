import express from "express";
import path from "path";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import jwt from "jsonwebtoken";

import schema from "./schema.js";

import { connect } from "./database.js";

import dotenv from "dotenv";

import waypointAuth from "./auth/waypointAuth.js";

dotenv.config();

const SECRET = process.env.SECRET;

const __dirname = path.resolve();

const app = express();
app.use(cors());
app.use(express.json())
connect();

app.use((req, res, next)=> {
    const authHeader = req.headers.authorization;

    if(authHeader)
    {
        const token = authHeader.split(" ")[1];

        try
        {
            const user = jwt.verify(token, SECRET);
            req.user = user;
        } 
        catch (error)
        {
            console.error("Token invalid: ", error.message);
            req.user = null;
        }
    }
    else
    {
        req.user = null;
    }

    next();
});

app.use('/graphql', graphqlHTTP((req) => ({
    graphiql: true,
    schema: schema,
    context: {
        userToken: req.user
    }
})));

app.use("/auth", waypointAuth);

app.use(express.static(path.join(__dirname, "src/public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "src/public", "index.html"));
});

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));