import { extendType } from "@nexus/schema";

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.float("mutateRandom", {
      resolve() {
        const n = Math.round(Math.random() * 100);
        if (n < 50) {
          throw new Error("n was less than 50");
        }
        return n;
      }
    });
  }
});
