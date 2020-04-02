import { NextPage } from "next";

import { graphql } from "@gqless/react";

import { query } from "../src/graphql";

const Page: NextPage = () => {
  return <div>{query.hello({ name: "zxc" })}</div>;
};

export default graphql(Page);
