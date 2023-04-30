import { createTRPCRouter } from "./trpc";
import { groceryRouter } from "./routers/grocery";
import { favoritesRouter } from "./routers/favorites"

export const appRouter = createTRPCRouter({
  grocery: groceryRouter,
  favorites: favoritesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
