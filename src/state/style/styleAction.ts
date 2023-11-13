import { AppDispatch } from "../store";
import { setStyle } from "./styleSlice";

export const setStyleConfig: Function =
  (color: string, size = "1.5rem") =>
  (dispatch: AppDispatch) => {
    dispatch(
      setStyle({
        data: {
          color,
          size,
        },
      })
    );
  };
