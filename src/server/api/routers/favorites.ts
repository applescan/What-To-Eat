import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const favoritesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.session.user;
    try {
      return await ctx.prisma.favoriteRecipe.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  addFavorites: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      try {
        return await ctx.prisma.favoriteRecipe.create({
          data: {
            title: input.title,
            userId,
            id: input.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  deleteOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.session.user;
      try {
        const { id } = input;
        return await ctx.prisma.favoriteRecipe.delete({
          where: {
            id
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});

