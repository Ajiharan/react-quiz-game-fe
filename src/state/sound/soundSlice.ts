import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface soundState {
  isEnabled: boolean;
  soundVolume: number;
}
const initialState: soundState = {
  isEnabled: true,
  soundVolume: 0.5,
};

const soundSlice = createSlice({
  name: "sound",
  initialState,
  reducers: {
    setSound: (state, action) => {
      state.isEnabled = action.payload.data.isEnabled;
      state.soundVolume = action.payload.data.volume;
    },
  },
});

export const { setSound } = soundSlice.actions;
export const soundEnabled = (state: RootState) => state.sound.isEnabled;
export const soundVolume = (state: RootState) => state.sound.soundVolume;

export default soundSlice.reducer;
