import { VendorApi } from "@/apis/vendor";
import { VendorUpsertDto } from "@/models/vendor";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ApiError } from "@/util/errors";
import { vendorActions } from "./slice";

export const useVendors = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.vendor);
  const actions = vendorActions;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await VendorApi.getAll();
      dispatch(actions.set(res.data));
    } catch (err) {
      return new ApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (vendor: VendorUpsertDto) => {
    try {
      const res = await VendorApi.create(vendor);
      dispatch(actions.add(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const update = async (vendor: VendorUpsertDto) => {
    try {
      const res = await VendorApi.update(vendor);
      dispatch(actions.update(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const remove = async (id: number) => {
    try {
      await VendorApi.delete(id);
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