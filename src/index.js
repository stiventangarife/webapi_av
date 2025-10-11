import express from "express";
import { graphqlHTTP } from "express-graphql";
import jwt from "jsonwebtoken";

import schema from "./schema.js";

import { connect } from "./database.js";

const SECRET = "supersecretkey";

const app = express();
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

app.listen(3000, () => console.log('Server on port 3000'));