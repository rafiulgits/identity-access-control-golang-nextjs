import { CustomerDto } from "@/models/customer";
import { GenericState, createGenericSlice } from "@/store/common/generic-slice";

export const customerSlice = createGenericSlice({
  name: "customers",
  initialState: {
    status: "idle",
    entities: [],
    error: null,
  } as GenericState<CustomerDto>,
  reducers: {},
});

export const customerReducer = customerSlice.reducer;
export const customerActions = customerSlice.actions;