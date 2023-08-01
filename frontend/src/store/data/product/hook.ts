import { ProductApi } from "@/apis/product";
import { ProductUpsertDto } from "@/models/product";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ApiError } from "@/util/errors";
import { productActions } from "./slice";

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.product);
  const actions = productActions;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await ProductApi.getAll();
      dispatch(actions.set(res.data));
    } catch (err) {
      return new ApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (product: ProductUpsertDto) => {
    try {
      const res = await ProductApi.create(product);
      dispatch(actions.add(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const update = async (product: ProductUpsertDto) => {
    try {
      const res = await ProductApi.update(product);
      dispatch(actions.update(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const remove = async (id: number) => {
    try {
      await ProductApi.delete(id);
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