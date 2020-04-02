import { extendType, objectType, stringArg } from "@nexus/schema";

export const HelloWorldObj = objectType({
  name: "HelloWorldObj",
  definition(t) {
    t.id("id");
    t.boolean("isOrNot");
  }
});

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
    t.field("obj", {
      type: "HelloWorldObj",
      resolve() {
        return {
          id: "zxc",
          isOrNot: true
        };
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
