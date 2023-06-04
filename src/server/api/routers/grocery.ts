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
      console.error(error)
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
        console.error(error)
      }
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      try {
        const { id, ...rest } = input;
        return await ctx.prisma.groceryList.update({
          where: { id },
          data: { ...rest },
        });
      } catch (error) {
        console.error(error)
      }
    }),
  deleteOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      try {
        // Find the item first to make sure it belongs to the current user
        const item = await ctx.prisma.groceryList.findUnique({
          where: { id: input.id },
        });

        if (!item || item.userId !== userId) {
          throw new Error("Item not found or you don't have permission to delete this item");
        }

        return await ctx.prisma.groceryList.delete({
          where: { id: input.id },
        });
      } catch (error) {
        console.error(error);
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
        console.error(error)
      }
    }),
});
