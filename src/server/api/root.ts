import { createTRPCRouter } from "./trpc";
import { groceryRouter } from "./routers/grocery";

export const appRouter = createTRPCRouter({
  grocery: groceryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
