import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers.js";
import typeDefs from "./schema.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import * as jose from "jose";

dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const context = async ({ req }) => {
  const token = (await req.headers.authorization) || "";
  // console.log("Token", token);
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  // console.log("Secret: ", secret);

  try {
    const { payload: user, protectedHeader } = await jose.jwtVerify(
      token,
      secret
    );

    // console.log(
    //   "protectedHeader : ***********************:",
    //   protectedHeader
    // );
    // console.log("User: ************************: ", user);
    return { user };
  } catch (error) {
    console.error("Invalid token:", error);
    // throw new AuthenticationError("Invalid token");
  }
};

const { url } = await startStandaloneServer(server, {
  context,
});

console.log(`🚀 Server listening at: ${url}`);
