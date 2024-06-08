import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtHelper } from "../../utlis/jwtHelper";
import config from "../../config";

interface userInfo {
  name: string;
  email: string;
  password: string;
}

export const authResolvers = {
  signup: async (parent: any, args: userInfo, { prisma }: any) => {
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

    const token = await jwtHelper.generateToken(
      { userId: newUser.id },
      config.jwt.secret as string
    );

    return { userError: null, token };
  },

  signIn: async (parent: any, args: any, { prisma }: any) => {
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

    const token = await jwtHelper.generateToken(
      { userId: user.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },
};
