import { PolicyApi } from "@/apis/policy";
import { PolicyUpsertDto } from "@/models/policy";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ApiError } from "@/util/errors";
import { policyActions } from "./slice";

export const usePolicies = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.policy);
  const actions = policyActions;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await PolicyApi.getAll();
      dispatch(actions.set(res.data));
    } catch (err) {
      return new ApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (policy: PolicyUpsertDto) => {
    try {
      const res = await PolicyApi.create(policy);
      dispatch(actions.add(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const update = async (policy: PolicyUpsertDto) => {
    try {
      const res = await PolicyApi.update(policy);
      dispatch(actions.update(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const remove = async (id: number) => {
    try {
      await PolicyApi.delete(id);
      dispatch(actions.remove(id));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const setLoading = (isLoading: boolean) => {
    dispatch(actions.setStatus(isLoading ? "loading" : "finished"));
  };

  return {
    fetch,
    add,
    update,
    remove,
    setLoading,
    state,
  };
};