import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// useAppDispatch
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;

// useAppSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
