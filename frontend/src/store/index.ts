import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./data/product";
import { customerReducer } from "./data/customer";
import { vendorReducer } from "./data/vendor";

const rootReducer = combineReducers({
  product: productReducer,
  customer: customerReducer,
  vendor: vendorReducer
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
