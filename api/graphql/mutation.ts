import { extendType } from "@nexus/schema";

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.float("mutateRandom", {
      resolve() {
        return Math.random() * 100;
      }
    });
  }
});
