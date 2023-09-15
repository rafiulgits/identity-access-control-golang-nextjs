import { UserApi } from "@/apis/user";
import { AccountUpsertDto, UserCreateDto, UserUpdateDto } from "@/models/user";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { ApiError } from "@/util/errors";
import { userActions } from "./slice";

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.user);
  const actions = userActions;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await UserApi.getAll();
      dispatch(actions.set(res.data));
    } catch (err) {
      return new ApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (user: UserCreateDto) => {
    try {
      const res = await UserApi.create(user);
      dispatch(actions.add(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const update = async (user: UserUpdateDto) => {
    try {
      const res = await UserApi.update(user);
      dispatch(actions.update(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const remove = async (id: number) => {
    try {
      await UserApi.delete(id);
      dispatch(actions.remove(id));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const addAccount = async (data: AccountUpsertDto) => {
    try {
      const res = await UserApi.createAccount(data);
      dispatch(actions.addAccount(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const updateAccount = async (data: AccountUpsertDto) => {
    try {
      const res = await UserApi.updateAccount(data);
      dispatch(actions.updateAccount(res.data));
    } catch (err) {
      return new ApiError(err);
    }
  };

  const removeAccount = async (userId: number, accountId: number) => {
    try {
      await UserApi.deleteAccount(userId, accountId);
      dispatch(actions.removeAccount({ userId: userId, accountId: accountId }));
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
    addAccount,
    updateAccount,
    removeAccount,
    state,
  };
};
