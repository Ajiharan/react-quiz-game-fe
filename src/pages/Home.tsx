import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import axios from "../api/Axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useHistory } from "react-router-dom";
import "./home.scss";
const Home = () => {
  const [viewDialog, setViewDialog] = useState(false);
  const [highScoreDetail, setHighScoreDetail] = useState([]);
  const history = useHistory();
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
    history.push("/login");
  };
  return (
    <React.Fragment>
      <div className="home-container">
        <Card title="Welcome to quiz game" subTitle="Quiz Game ">
          <div className="home-button-grp">
            <Button
              label="Start Game"
              className="p-button-success"
              onClick={onStart}
            />
            <Button
              label="HighScore"
              className="p-button-secondary"
              onClick={() => setViewDialog(true)}
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
    </React.Fragment>
  );
};

export default Home;
