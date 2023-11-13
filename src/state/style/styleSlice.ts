import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface styleState {
  color: { r: number; g: number; b: number };
  size: string;
}
const initialState: styleState = {
  color: { r: 0, g: 0, b: 0 },
  size: "25px",
};

const styleSlice = createSlice({
  name: "style",
  initialState,
  reducers: {
    setStyle: (state, action) => {
      state.color = action.payload.data.color;
      state.size = action.payload.data.size;
    },
  },
});

export const { setStyle } = styleSlice.actions;
export const styleSelector = (state: RootState): styleState => state.style;

export default styleSlice.reducer;
