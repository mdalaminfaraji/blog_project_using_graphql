import { userLoader } from "../dataLoaders/userLoaders";

export const Post = {
  author: async (parent: any, args: any, { prisma, userInfo }: any) => {
    return userLoader.load(parent.authorId);
  },
};
