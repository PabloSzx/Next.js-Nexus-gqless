import { Client, getAccessor, NetworkStatus, QueryFetcher } from "gqless";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { endpoint } from "./client";
import { Mutation, Query, schema } from "./generated";

type IState = "waiting" | "loading" | "error" | "done";

type IQueryFn<TData> = (schema: Client<Query>["query"]) => TData;

export const useQuery = <TData extends any>(
  queryFn: IQueryFn<TData>,
  {
    lazy = false
  }: {
    lazy?: boolean;
  } = {}
): [
  { state: IState; data: TData | undefined },
  (queryFn?: IQueryFn<TData>) => Promise<TData>
] => {
  const [state, setState] = useState<IState>(lazy ? "waiting" : "loading");
  const [data, setData] = useState<TData | undefined>(undefined);

  const fetchQuery = useCallback<QueryFetcher>(
    async (query, variables) => {
      setState("loading");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: query,
          variables
        }),
        mode: "cors"
      });

      if (!response.ok) {
        setState("error");
        throw new Error(
          `Network error, received status code ${response.status}`
        );
      }

      const json = await response.json();
      setState("done");

      return json;
    },
    [setState]
  );

  const queryClient = useMemo<Client<Query>>(
    () => new Client<Query>(schema.Query, fetchQuery),
    [fetchQuery]
  );

  const queryCallback = useCallback<
    (queryFnArg?: IQueryFn<TData>) => Promise<TData>
  >(
    async queryFnArg => {
      const query = queryFnArg || queryFn;
      const accessor = getAccessor(query(queryClient.query));

      if (accessor.status === NetworkStatus.idle) {
        accessor.scheduler.commit.stage(accessor);

        query(queryClient.query);
      }

      await new Promise(resolve => {
        queryClient.scheduler.commit.onFetched(() => {
          resolve();
        });
      });

      const val = query(queryClient.query);

      setData(val);

      return val;
    },
    [queryClient, setData]
  );

  const isMountedRef = useRef(false);

  if (!isMountedRef.current && !lazy) {
    queryCallback().catch(error => {
      console.error(error);
    });
  }

  useEffect(() => {
    isMountedRef.current = true;
  }, [isMountedRef]);

  return useMemo(() => [{ state, data }, queryCallback], [
    queryCallback,
    state,
    data
  ]);
};

type IMutationFn<TData> = (schema: Client<Mutation>["query"]) => TData;

export const useMutation = <TData extends any>(
  mutationFn: IMutationFn<TData>
): [
  (mutationFn?: IMutationFn<TData>) => Promise<TData>,
  { state: IState; data: TData | undefined }
] => {
  const [state, setState] = useState<IState>("waiting");

  const [data, setData] = useState<TData | undefined>(undefined);

  const fetchMutation = useCallback<QueryFetcher>(
    async (query, variables) => {
      setState("loading");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: "mutation" + query,
          variables
        }),
        mode: "cors"
      });

      if (!response.ok) {
        setState("error");
        throw new Error(
          `Network error, received status code ${response.status}`
        );
      }

      const json = await response.json();
      setState("done");

      return json;
    },
    [setState]
  );
  const mutationClient = useMemo<Client<Mutation>>(() => {
    return new Client<Mutation>(schema.Mutation, fetchMutation);
  }, [fetchMutation]);

  const mutationCallback = useCallback<
    (mutationFnArg?: IMutationFn<TData>) => Promise<TData>
  >(
    async mutationFnArg => {
      const mutation = mutationFnArg || mutationFn;
      const accessor = getAccessor(mutation(mutationClient.query));

      if (accessor.status === NetworkStatus.idle) {
        accessor.scheduler.commit.stage(accessor);

        mutation(mutationClient.query);
      }

      await new Promise(resolve => {
        mutationClient.scheduler.commit.onFetched(() => {
          resolve();
        });
      });

      const val = mutation(mutationClient.query);

      setData(val);

      return val;
    },
    [mutationClient, setData]
  );

  return useMemo(() => [mutationCallback, { state, data }], [
    mutationCallback,
    state,
    data
  ]);
};
