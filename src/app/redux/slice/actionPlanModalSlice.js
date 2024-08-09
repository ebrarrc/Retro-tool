import { createSlice } from "@reduxjs/toolkit";
import {
  addActionItemToFirestore,
  removeActionItemFromFirestore,
  getActionItemsFromFirestore,
} from "@/services/fireStoreService";

const initialState = {
  isVisible: false,
  actionItems: [],
  status: "idle",
  error: null,
};

const actionPlanModalSlice = createSlice({
  name: "actionPlanModal",
  initialState,
  reducers: {
    showActionPlanModal: (state) => {
      state.isVisible = true;
    },
    hideActionPlanModal: (state) => {
      state.isVisible = false;
    },
    setActionItems: (state, action) => {
      state.actionItems = action.payload;
    },
    addActionPlanItem: (state, action) => {
      state.actionItems.push(action.payload);
    },
   
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  showActionPlanModal,
  hideActionPlanModal,
  setActionItems,
  addActionPlanItem,

  setStatus,
  setError,
} = actionPlanModalSlice.actions;

export default actionPlanModalSlice.reducer;
