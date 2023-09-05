import { UserDto } from "@/models/user";
import { GenericState, createGenericSlice } from "@/store/common/generic-slice";

export const userSlice = createGenericSlice({
  name: "users",
  initialState: {
    status: "idle",
    entities: [],
    error: null,
  } as GenericState<UserDto>,
  reducers: {},
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
