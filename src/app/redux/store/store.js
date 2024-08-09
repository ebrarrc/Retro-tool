import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../slice/boardSlice";
import actionPlanModalReducer from "../slice/actionPlanModalSlice";
import finishRetroModalReducer from "../slice/finishRetroModalSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    actionPlanModal: actionPlanModalReducer,
    finishRetroModal: finishRetroModalReducer,
  },
});
