import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from "./resolvers.js";

const typeDefs = `
    type Query{
        users: [User]
        userByWallet(wallet: String): User
        axiesByUser(idUser: ID): [AxieUser]
    }

    type AuthPayload {
        token: String!
        user: User
    }

    type User{
        _id: ID
        wallet: String
    }

    type AxieUser{
        _id: ID
        axieId: String
        axieName: String
        level: Int
        maxHealth: Int
        currentHealth: Int
        maxEnergy: Int
        currentEnergy: Int
        initiative: Int
        attack: Int
        idUser: ID
    }

    type Mutation {
        createUser(input: CreateUserInput): AuthPayload
        loginUser(input: LoginUserInput): AuthPayload

        createAxieUser(input: CreateAxieUserInput): AxieUser
        updateAxieUser(_id: ID, input: UpdateAxieUserInput): AxieUser
        deleteAxieUser(_id: ID): AxieUser
    }

    input CreateUserInput {
        wallet: String!
        password: String!
    }

    input LoginUserInput {
        wallet: String!
        password: String!
    }

    input CreateAxieUserInput {
        axieId: String!
        axieName: String!
        level: Int!
        maxHealth: Int!
        currentHealth: Int!
        maxEnergy: Int!
        currentEnergy: Int!
        initiative: Int!
        attack: Int!
        idUser: ID!
    }

    input UpdateAxieUserInput {
        axieName: String
        level: Int
        maxHealth: Int
        currentHealth: Int
        maxEnergy: Int
        currentEnergy: Int
        initiative: Int
        attack: Int
        idUser: ID
    }
`;

export default makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
})


