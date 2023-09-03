import { PolicyDto } from "@/models/policy";
import { GenericState, createGenericSlice } from "@/store/common/generic-slice";

export const policySlice = createGenericSlice({
  name: "policies",
  initialState: {
    status: "idle",
    entities: [],
    error: null,
  } as GenericState<PolicyDto>,
  reducers: {},
});

export const policyReducer = policySlice.reducer;
export const policyActions = policySlice.actions;