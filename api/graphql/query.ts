import { extendType, stringArg } from "@nexus/schema";

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.string("hello", {
      args: { name: stringArg({ nullable: true }) },
      resolve: (parent, { name }, ctx) => {
        console.log({
          ctx
        });
        return `Hello ${name || "World"}!`;
      }
    });
  }
});

export const OtherQuery = extendType({
  type: "Query",
  definition(t) {
    t.boolean("asd", {
      resolve() {
        return true;
      }
    });
  }
});
