import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const groceryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session.user;
    try {
      return await ctx.prisma.groceryList.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      try {
        return await ctx.prisma.groceryList.create({
          data: {
            title: input.title,
            userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      try {
        const { id, ...rest } = input;
        return await ctx.prisma.groceryList.update({
          where: { id_userId: { id, userId } },
          data: { ...rest },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteAll: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
      const { userId } = ctx.session.user;
      try {
        return await ctx.prisma.groceryList.deleteMany({
          where: {
            userId,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
