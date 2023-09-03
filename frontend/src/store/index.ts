import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./data/product";
import { customerReducer } from "./data/customer";
import { vendorReducer } from "./data/vendor";
import { policyReducer } from "./data/policy";

const rootReducer = combineReducers({
  product: productReducer,
  customer: customerReducer,
  vendor: vendorReducer,
  policy: policyReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
