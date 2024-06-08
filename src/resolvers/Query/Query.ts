export const Query = {
  me: async (parent: any, args: any, { prisma, userInfo }: any) => {
    console.log(userInfo);
    return await prisma.user.findUnique({
      where: {
        id: Number(userInfo.userId),
      },
    });
  },
  profile: async (parent: any, args: any, { prisma, userInfo }: any) => {
    console.log(userInfo);
    return await prisma.profile.findUnique({
      where: {
        userId: Number(args.userId),
      },
    });
  },

  users: async (parent: any, args: any, { prisma }: any) => {
    return await prisma.user.findMany();
  },
  posts: async (parent: any, args: any, { prisma }: any) => {
    console.log("post");
    return await prisma.post.findMany({
      where: {
        published: false,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
