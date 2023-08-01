import { ProductDto } from "@/models/product";
import { GenericState, createGenericSlice } from "@/store/common/generic-slice";

export const productSlice = createGenericSlice({
  name: "products",
  initialState: {
    status: "idle",
    entities: [],
    error: null,
  } as GenericState<ProductDto>,
  reducers: {},
});

export const productReducer = productSlice.reducer;
export const productActions = productSlice.actions;