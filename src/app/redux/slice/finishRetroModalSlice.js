
import { createSlice } from '@reduxjs/toolkit';

const finishRetroModalSlice = createSlice({
  name: 'finishRetroModal',
  initialState: {
    isVisible: false,
  },
  reducers: {
    showFinishRetroModal: (state) => {
      state.isVisible = true;
    },
    hideFinishRetroModal: (state) => {
      state.isVisible = false;
    },
  },
});

export const { showFinishRetroModal, hideFinishRetroModal } = finishRetroModalSlice.actions;
export default finishRetroModalSlice.reducer;
