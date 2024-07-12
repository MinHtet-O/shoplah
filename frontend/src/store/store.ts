import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./itemsSlice";
import categoriesReducer from "./categorysSlice";
import offersReducer from "./offersSlice";
import authReducer from "./authSlice";
import filterReduce from "./filterSlice";
import purchaseReducer from "./purchaseSlice";
const store = configureStore({
  reducer: {
    items: itemsReducer,
    categories: categoriesReducer,
    offers: offersReducer,
    auth: authReducer,
    filter: filterReduce,
    purchase: purchaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
