import { AppDispatch } from "../store";
import { setSound } from "./soundSlice";

export const setSoundConfig: Function =
  (isEnabled: boolean, volume = 0.5) =>
  (dispatch: AppDispatch) => {
    dispatch(
      setSound({
        data: {
          isEnabled: isEnabled,
          volume: volume,
        },
      })
    );
  };
