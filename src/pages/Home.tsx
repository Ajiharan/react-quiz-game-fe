import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useHistory } from "react-router-dom";
import "./home.scss";
import useSound from "use-sound";
import click1 from "../assets/click1.wav";
import { useAppSelector } from "../state/hook/stateHook";
import { soundEnabled, soundVolume } from "../state/sound/soundSlice";
import { useDispatch } from "react-redux";
import { setSoundConfig } from "../state/sound/soundAction";

import { Slider } from "primereact/slider";

import { TriStateCheckbox } from "primereact/tristatecheckbox";

const Home = () => {
  const dispatch = useDispatch();
  const isSoundEnabled = useAppSelector(soundEnabled);
  const volume = useAppSelector(soundVolume);
  const [viewDialog, setViewDialog] = useState(false);
  const [viewSoundConfig, setViewSoundConfig] = useState(false);

  const [highScoreDetail, setHighScoreDetail] = useState([]);
  const history = useHistory();
  const [playButton] = useSound(click1, { volume });

  useEffect(() => {
    axios
      .get("/board/scores")
      .then((res: any) => {
        console.log("data", res.data);
        setHighScoreDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onStart = (): void => {
    if (isSoundEnabled) {
      playButton();
    }

    history.push("/login");
  };

  const onSoundClick = (): void => {
    if (isSoundEnabled) {
      playButton();
    }
    setViewSoundConfig(true);
  };

  return (
    <React.Fragment>
      <div className="home-container">
        <Card title="Welcome to quiz game" subTitle="Quiz Game ">
          <div className="home-button-grp">
            <Button
              label="Play Game"
              className="p-button-success"
              onClick={onStart}
            />
            <Button
              label="Sound Settings"
              className="p-button-info"
              onClick={onSoundClick}
            />
            <Button
              label="HighScore Board"
              className="p-button-secondary"
              onClick={() => {
                setViewDialog(true);
                if (isSoundEnabled) {
                  playButton();
                }
              }}
            />
          </div>
        </Card>
      </div>
      <Dialog
        header="HighScore List"
        visible={viewDialog}
        style={{ width: "50vw" }}
        modal
        onHide={() => setViewDialog(false)}
      >
        <h5>#HighScores</h5>
        <DataTable value={highScoreDetail} responsiveLayout="scroll">
          <Column field="userName" header="Username"></Column>
          <Column field="highScore" header="High Score"></Column>
        </DataTable>
      </Dialog>

      <Dialog
        header="Settings"
        visible={viewSoundConfig}
        style={{ width: "45vw" }}
        modal
        onHide={() => setViewSoundConfig(false)}
      >
        <div className="grid">
          <div className="row mt-4 p-2" style={{ width: "100%" }}>
            <div className="col-6">
              <label>Sound Enabled</label>
            </div>
            <div className="col-6">
              <TriStateCheckbox
                value={isSoundEnabled}
                onChange={(e) => {
                  dispatch(setSoundConfig(!isSoundEnabled));
                }}
              />
            </div>
          </div>
          <div className="row mt-4 p-2" style={{ width: "100%" }}>
            <div className="col-6">
              <label>Volume</label>
            </div>
            <div className="col-6">
              <Slider
                onChange={(e) => {
                  console.log("value", e.value);
                  dispatch(
                    setSoundConfig(isSoundEnabled, (e.value as number) / 100)
                  );
                }}
                value={volume * 100}
                disabled={!isSoundEnabled}
                className="w-14rem"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default Home;
