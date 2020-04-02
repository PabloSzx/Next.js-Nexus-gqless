import { NextPage } from "next";

import { graphql } from "@gqless/react";

import { query } from "../src/graphql";
import { useMutation, useQuery } from "../src/graphql/hooks";

const Page: NextPage = () => {
  const [mutationHookCall, mutationHook] = useMutation(
    schema => schema.mutateRandom
  );
  const [queryHook, refetchQueryHook] = useQuery(
    schema =>
      schema.hello({
        name: "other"
      }),
    {
      lazy: true
    }
  );

  return (
    <div>
      {query.hello({ name: "zxc" })}

      <br />

      <br />

      <p>query hook state {queryHook.state}</p>
      <p>query hook data {`${queryHook.data}`}</p>
      <button
        onClick={() => {
          refetchQueryHook();
        }}
      >
        refetch query hook
      </button>

      <br />

      <br />

      <p>mutation hook state {mutationHook.state}</p>
      <p>mutation hook data {`${mutationHook.data}`}</p>
      <button
        onClick={() => {
          mutationHookCall();
        }}
      >
        refetch mutation hook
      </button>
    </div>
  );
};

export default graphql(Page);
