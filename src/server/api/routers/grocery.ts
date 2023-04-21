
// import { z } from "zod";
// import { createTRPCRouter, protectedProcedure } from "../trpc";

// export const groceryRouter = createTRPCRouter({
//   getAll: protectedProcedure.query(async ({ ctx }) => {
//     try {
//       return await ctx.prisma.groceryList.findMany();
//     } catch (error) {
//       console.log("error", error);
//     }
//   }),
//   postMessage: protectedProcedure
//     .input(
//       z.object({
//         title: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       try {
//         await ctx.prisma.groceryList.create({
//           data: {
//             title: input.title
//           },
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }),
// });

// import * as trpc from "@trpc/server";
// import { z } from "zod";

// import { Context } from "./context";

// export const serverRouter = trpc
//   .router<Context>()
//   .query("findAll", {
//     resolve: async ({ ctx }) => {
//       return await ctx.prisma.groceryList.findMany();
//     },
//   })
//   .mutation("insertOne", {
//     input: z.object({
//       title: z.string(),
//     }),
//     resolve: async ({ input, ctx }) => {
//       return await ctx.prisma.groceryList.create({
//         data: { title: input.title },
//       });
//     },
//   })
//   .mutation("updateOne", {
//     input: z.object({
//       id: z.number(),
//       title: z.string(),
//       checked: z.boolean(),
//     }),
//     resolve: async ({ input, ctx }) => {
//       const { id, ...rest } = input;

//       return await ctx.prisma.groceryList.update({
//         where: { id },
//         data: { ...rest },
//       });
//     },
//   })
//   .mutation("deleteAll", {
//     input: z.object({
//       ids: z.number().array(),
//     }),
//     resolve: async ({ input, ctx }) => {
//       const { ids } = input;

//       return await ctx.prisma.groceryList.deleteMany({
//         where: {
//           id: { in: ids },
//         },
//       });
//     },
//   });


import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const groceryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.groceryList.findMany();
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
      try {
        return await ctx.prisma.groceryList.create({
          data: {
            title: input.title,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        checked: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...rest } = input;
        return await ctx.prisma.groceryList.update({
          where: { id },
          data: { ...rest },
        });
      } catch (error) {
        console.log(error);
      }
    }),
    deleteAll: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.prisma.groceryList.deleteMany({});
      } catch (error) {
        console.log(error);
      }
    }),
});
