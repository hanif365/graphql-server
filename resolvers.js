import StudentModel from "./models/student.js";
import UserModel from "./models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as jose from 'jose'

dotenv.config();

const resolvers = {
  Query: {
    students: async () => {
      return await StudentModel.find();
    },
    student: async (_, { id }) => {
      return await StudentModel.findById(id);
    },

    users: async (_, {id}, {user}) => {
      console.log("User in Inner: ********************************: ,", user);
      // if (!user) {
      //   throw new Error("You must be logged in first");
      // }
      return await UserModel.find();
    },  
    user: async (_, { id }) => {
      return await UserModel.findById(id);
    },
  },
  Mutation: {
    createStudent: async (_, { name, age }) => {
      return await StudentModel.create({ name, age });
    },
    updateStudent: async (_, { id, name, age }) => {
      return await StudentModel.findByIdAndUpdate(
        id,
        { name, age },
        { new: true }
      );
    },
    deleteStudent: async (_, { id }) => {
      const student = await StudentModel.findById(id);
      if (!student) {
        throw new Error("Student not found");
      }
      await StudentModel.deleteOne({ _id: id });
      return student;
    },

    // Registration system
    register: async (_, { name, email, phone, username, password }) => {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        throw new Error("User already existed!");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        email,
        phone,
        username,
        password: hashedPassword,
      });
      await newUser.save();

      return "User registered successfully";
    },

    signIn: async (_, { email, password }) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      const secret = new TextEncoder().encode(
        process.env.SECRET_KEY,
      )

      console.log("SECRET: ************************************: ", secret);
      const alg = 'HS256'
      
      const token = await new jose.SignJWT({ userId: user._id, email: user.email })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(user.name)
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')
        .sign(secret)
      
      console.log("Alhamdullilah: ***************************: ", token)
      return {token}
    },
  },
};

export default resolvers;
