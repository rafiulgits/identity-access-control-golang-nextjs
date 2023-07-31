import {
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";

interface Entity {
  id: number | string;
}

type Status = "idle" | "loading" | "finished" | "error";

export interface GenericState<T extends Entity> {
  entities: T[];
  status: Status;
  error: string | null;
}

export const createGenericSlice = <
  T extends Entity,
  State extends GenericState<T>,
  Reducers extends SliceCaseReducers<State>
>({
  name = "",
  initialState,
  reducers,
  extraReducers,
}: {
  name: string;
  initialState: State;
  reducers: ValidateSliceCaseReducers<State, Reducers>;
  extraReducers?: (builder: ActionReducerMapBuilder<State>) => void;
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      set(state: State, action: PayloadAction<Array<T>>) {
        state.entities = action.payload;
      },
      add(state: State, action: PayloadAction<T>) {
        state.entities.push(action.payload);
      },
      update(state: State, action: PayloadAction<T>) {
        let idx = state.entities.findIndex(
          (item) => item.id === action.payload.id
        );
        if (idx >= 0) {
          state.entities[idx] = action.payload;
        }
      },
      remove(state: State, action: PayloadAction<number | string>) {
        let idx = state.entities.findIndex(
          (item) => item.id === action.payload
        );
        if (idx >= 0) {
          state.entities.splice(idx, 1);
        }
      },
      setStatus(state: State, action: PayloadAction<Status>) {
        state.status = action.payload;
      },
      ...reducers,
    },
    extraReducers: extraReducers,
  });
};
