import { AccountDto, UserDto } from "@/models/user";
import { GenericState, createGenericSlice } from "@/store/common/generic-slice";
import { PayloadAction } from "@reduxjs/toolkit";

interface State extends GenericState<UserDto> {}

export const userSlice = createGenericSlice({
  name: "users",
  initialState: {
    status: "idle",
    entities: [],
    error: null,
  } as State,
  reducers: {
    addAccount: (state: State, action: PayloadAction<AccountDto>) => {
      const userIndex = state.entities.findIndex(
        (u) => u.id === action.payload.userId
      );
      let accounts = state.entities[userIndex].accounts;
      accounts.push(action.payload);
    },
    updateAccount: (state: State, action: PayloadAction<AccountDto>) => {
      const userIndex = state.entities.findIndex(
        (u) => u.id === action.payload.userId
      );
      let accounts = state.entities[userIndex].accounts;
      const accountIndex = accounts.findIndex(
        (a) => a.id === action.payload.id
      );
      accounts[accountIndex] = action.payload;
    },

    removeAccount: (
      state: State,
      action: PayloadAction<{ userId: number; accountId: number }>
    ) => {
      const userIndex = state.entities.findIndex(
        (u) => u.id === action.payload.userId
      );
      let accounts = state.entities[userIndex].accounts;
      const accountIndex = accounts.findIndex(
        (a) => a.id === action.payload.accountId
      );
      if (accountIndex >= 0) {
        accounts.splice(accountIndex, 1);
      }
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
