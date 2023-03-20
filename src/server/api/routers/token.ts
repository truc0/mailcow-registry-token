import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const tokenRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  verify: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(({ ctx, input }) => {
      const token = ctx.prisma.token.findFirst({
        where: {
          token: input.token,
        }
      });

      return {
        valid: !!token,
      }
    })
});
