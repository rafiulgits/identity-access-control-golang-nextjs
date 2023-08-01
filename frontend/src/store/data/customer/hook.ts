import { CustomerApi } from "@/apis/customer";
import { CustomerUpsertDto } from "@/models/customer";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ApiError } from "@/util/errors";
import { customerActions } from "./slice";

export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.customer);
  const actions = customerActions;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await CustomerApi.getAll();
      dispatch(actions.set(res.data));
    } catch (err) {
      return new ApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (customer: CustomerUpsertDto) => {
    try {
      const res = await CustomerApi.create(customer);
      dispatch(actions.add(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const update = async (customer: CustomerUpsertDto) => {
    try {
      const res = await CustomerApi.update(customer);
      dispatch(actions.update(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const remove = async (id: number) => {
    try {
      await CustomerApi.delete(id);
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