import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "../../api/Axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useHistory } from "react-router-dom";
import "./dashboard.scss";
const Dashboard = (props: any) => {
  const [highScoreDetail, setHighScoreDetail] = useState([]);
  const [myScoreDetail, setMyScoreDetail] = useState([]);
  const [userDetail, setUserDetail] = useState<any>(null);

  const history = useHistory();
  useEffect(() => {
    axios
      .get("/board/scores")
      .then((res: any) => {
        setHighScoreDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/user/detail", { headers: { quiz: localStorage.getItem("quiz") } })
      .then((res: any) => {
        setUserDetail(res.data);
        axios
          .get(`/score/getScores/${res.data.user._id}`, {
            headers: { quiz: localStorage.getItem("quiz") },
          })
          .then((res: any) => {
            setMyScoreDetail(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onPlay = (): void => {
    history.push("/game");
  };

  const logout = (): void => {
    localStorage.clear();
    history.replace("/login");
  };

  return (
    <React.Fragment>
      <div className="dashboard-container">
        <Card
          title={`Welcome, ${userDetail?.user?.userName}`}
          subTitle="Quiz Game "
        >
          <div className="home-button-grp">
            <Button
              label="Play Game"
              className="p-button-success"
              onClick={onPlay}
            />
            <Button
              label="Logout"
              className="p-button-danger"
              onClick={logout}
            />
          </div>
          <div className="grid">
            <div className="col-12 md:col-6 lg:col-6 sm:col-12">
              <h5>#HighScores</h5>
              <DataTable value={highScoreDetail} responsiveLayout="scroll">
                <Column field="userName" header="Username"></Column>
                <Column field="highScore" header="High Score"></Column>
              </DataTable>
            </div>
            <div className="col-12 md:col-6 lg:col-6 sm:col-12">
              <h5>#MyScores</h5>
              <DataTable value={myScoreDetail} responsiveLayout="scroll">
                <Column field="userName" header="Username"></Column>
                <Column field="score" header="Score"></Column>
              </DataTable>
            </div>
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
