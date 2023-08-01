import { VendorDto } from "@/models/vendor";
import { GenericState, createGenericSlice } from "@/store/common/generic-slice";

export const vendorSlice = createGenericSlice({
  name: "vendors",
  initialState: {
    status: "idle",
    entities: [],
    error: null,
  } as GenericState<VendorDto>,
  reducers: {},
});

export const vendorReducer = vendorSlice.reducer;
export const vendorActions = vendorSlice.actions;