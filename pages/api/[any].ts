import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { createGraphqlMiddleware } from "express-gql";
import {
  RenderPageOptions,
  renderPlaygroundPage,
} from "graphql-playground-html";
import { PageConfig } from "next";

import { schema } from "../../api/schema";

const app = express();

const context = ({ req }: { req: Request; res: Response }) => {
  return { req };
};

declare global {
  interface NexusGen {
    context: ReturnType<typeof context>;
  }
}

app.post(
  "/api/graphql",
  bodyParser.json(),
  createGraphqlMiddleware({
    context,
    formatError: ({ req, error }) => error,
    schema
  })
);

const playgroundOptions: RenderPageOptions = {
  endpoint: "/api/graphql"
};

app.get(["/api/playground", "/api/graphql"], (req, res) => {
  res.type("text/html");
  res.send(renderPlaygroundPage(playgroundOptions));
});

export default app;

export const config: PageConfig = {
  api: {
    bodyParser: false
  }
};
