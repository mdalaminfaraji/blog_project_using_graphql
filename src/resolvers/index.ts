import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelper } from "../utlis/jwtHelper";
import config from "../config";
const prisma = new PrismaClient();

interface userInfo {
  name: string;
  email: string;
  password: string;
}
export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: userInfo, context: any) => {
      const isExit = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (isExit) {
        return {
          userError: "User Already Exists",
          token: null,
        };
      }
      const hashedPassword = await bcrypt.hash(args.password, 12);

      const newUser = await prisma.user.create({
        data: { ...args, password: hashedPassword },
      });

      const token = await jwtHelper(
        { userId: newUser.id },
        config.jwt.secret as string
      );

      return { userError: null, token };
    },

    signIn: async (parent: any, args: any, context: any) => {
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      if (!user) {
        return {
          userError: "User is not Valid",
          token: null,
        };
      }

      const correctPass = await bcrypt.compare(args.password, user.password);
      if (!correctPass) {
        return {
          userError: "Password wrong",
          token: null,
        };
      }

      const token = await jwtHelper(
        { userId: user.id },
        config.jwt.secret as string
      );
      return {
        userError: null,
        token,
      };
    },
  },
};
