import { NextPage } from "next";

import { query, useMutation, useQuery } from "../src/graphql";

const Page: NextPage = () => {
  const [mutationHookCall, mutationHook] = useMutation(
    (schema) => schema.mutateRandom
  );
  const n = Math.round(Math.random() * 50);

  const [queryHook, refetchQueryHook] = useQuery(
    (schema) => {
      return schema.hello({
        name: "other" + n,
      });
    },
    {
      lazy: false,
      pollInterval: 2000,
    }
  );

  const [complexQueryHook, refetchComplexQueryHook] = useQuery(
    ({ obj: { id, isOrNot } }) => ({
      id,
      isOrNot,
    }),
    {
      lazy: true,
    }
  );

  return (
    <div>
      {query.hello({ name: "zxc" })}

      <br />

      <br />

      <p>query hook state {queryHook.state}</p>
      <p>query hook data {`${queryHook.data}`}</p>
      <p>
        query hook errors {`${queryHook.errors?.map((value) => value.message)}`}
      </p>
      <button
        onClick={() => {
          const n = Math.round(Math.random() * 100).toString();
          refetchQueryHook((schema) =>
            schema.hello({
              name: "refetch" + n,
            })
          );
        }}
      >
        refetch query hook
      </button>
      <br />

      <br />

      <p>complex query hook state {complexQueryHook.state}</p>
      <p>
        complex query hook data {`${JSON.stringify(complexQueryHook.data)}`}
      </p>
      <p>
        complex query hook errors{" "}
        {`${complexQueryHook.errors?.map((value) => value.message)}`}
      </p>

      <button
        onClick={() => {
          refetchComplexQueryHook();
        }}
      >
        refetch complex query hook
      </button>

      <br />

      <br />

      <p>mutation hook state {mutationHook.state}</p>
      <p>mutation hook data {`${mutationHook.data}`}</p>
      <p>
        mutation hook errors{" "}
        {`${mutationHook.errors?.map((value) => value.message)}`}
      </p>
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

export default Page;
