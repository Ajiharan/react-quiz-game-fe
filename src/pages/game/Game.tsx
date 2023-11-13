import { Card } from "primereact/card";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import "./game.scss";
import axios from "../../api/Axios";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import timeOut from "../../assets/timeout1.mp3";
import useSound from "use-sound";
import { useAppSelector } from "../../state/hook/stateHook";
import { soundEnabled, soundVolume } from "../../state/sound/soundSlice";
import closeSound from "../../assets/close.mp3";
import wrongSound from "../../assets/wrong2.mp3";
import crctSound from "../../assets/correct1.mp3";
const Game = (props: any) => {
  const volume = useAppSelector(soundVolume);
  const isSoundEnabled = useAppSelector(soundEnabled);
  const [playAlarm] = useSound(timeOut, { volume });
  const [exitSound] = useSound(closeSound, { volume });
  const [inCorrectSound] = useSound(wrongSound, { volume });
  const [correctSound] = useSound(crctSound, { volume });
  const answerArray: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [highScoreDetail, setHighScoreDetail] = useState([]);
  const [myScoreDetail, setMyScoreDetail] = useState([]);
  const [userDetail, setUserDetail] = useState<any>(null);
  const [cuLevelTimer, setCuLevelTimer] = useState<number>(15);
  const [levelTimer, setLevelTimer] = useState<number>(cuLevelTimer);
  const [livesCount, setLivesCount] = useState<number>(4);
  const [score, setScore] = useState<number>(0);
  const [myScore, setMyscore] = useState<number>(0);
  const [queAns, setQueAns] = useState<{
    question: string;
    solution: number;
  } | null>(null);

  const [level, setLevel] = useState<number>(1);
  const [levelQuestionCount, setLevelQuestionCount] = useState<number>(6);
  const [hasFinished, setFinished] = useState<boolean>(false);
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [wrongCount, setWrongCount] = useState(0);

  const intervalRef = useRef<any>(null);
  const history = useHistory();

  const confirm = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        history.push("/dashboard");
      },
      reject: () => {},
    });
  };

  const getUser = (): void => {
    axios
      .get("/user/detail", { headers: { quiz: localStorage.getItem("quiz") } })
      .then((res: any) => {
        setUserDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getUser();
    getQuestion();
  }, []);

  useEffect(() => {
    if (levelTimer === 0) {
      setQueAns(null);
      clearInterval(intervalRef.current);
      if (livesCount > 0) {
        getQuestion();
        setLevelTimer(cuLevelTimer);
        setLivesCount(livesCount - 1);
        return;
      }
    }
    if (livesCount === 0) {
      clearInterval(intervalRef.current);
      setMyscore(score);
      setLevelTimer(0);
      if (levelTimer === 0) {
        addScore();
      }
    }
  }, [levelTimer, livesCount]);

  useEffect(() => {
    if (wrongCount > 0) {
      getQuestion();
    }
  }, [wrongCount]);

  const getHighScores = (): Promise<any> => {
    return axios.get("/board/scores");
  };

  const getMyScores = (id: any): Promise<any> => {
    return axios.get(`/score/getScores/${id}`, {
      headers: { quiz: localStorage.getItem("quiz") },
    });
  };

  const addScore = (): void => {
    axios
      .post(
        "/score/addScore",
        {
          score: score,
          userName: userDetail.user.userName,
          uid: userDetail.user._id,
        },
        { headers: { quiz: localStorage.getItem("quiz") } }
      )
      .then((res) => {
        Promise.all([getHighScores(), getMyScores(userDetail.user?._id)]).then(
          (results: any[]) => {
            console.log("results", results);
            setHighScoreDetail(results[0].data);
            setMyScoreDetail(results[1].data);
          }
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const wrongAnswer = () => {
    if (isSoundEnabled) {
      inCorrectSound();
    }

    setLivesCount(livesCount - 1);

    setWrongCount(wrongCount + 1);
  };

  useEffect(() => {
    // console.log("queAns", queAns);
    if (levelTimer < 6 && levelTimer > 0) {
      if (isSoundEnabled) {
        playAlarm();
      }
    }
    if (queAns && levelTimer > 0) {
      startTimer();
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [levelTimer, queAns]);

  const startTimer = (): void => {
    intervalRef.current = setInterval(() => {
      setLevelTimer(levelTimer - 1);
    }, 1000);
  };

  const getRandomQuestion = (): void => {
    Axios.get("https://marcconrad.com/uob/tomato/api.php?out=json")
      .then((res: any) => {
        setQueAns(res.data);
        setDisabled(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    if (levelQuestionCount === 0) {
      if (level === 1) {
        setLevelQuestionCount(8);
      } else if (level === 2) {
        setLevelQuestionCount(10);
      } else {
        setLivesCount(0);
        setFinished(true);
        return;
      }
      setLevel(level + 1);
      setCuLevelTimer(cuLevelTimer - 5);
    }
  }, [levelQuestionCount, level, cuLevelTimer]);

  const getQuestion = (): void => {
    setLevelQuestionCount(levelQuestionCount - 1);
    setDisabled(true);
    getRandomQuestion();
  };

  const btnClick = (value: number): void => {
    if (queAns?.solution !== value) {
      setQueAns(null);
      setLevelTimer(cuLevelTimer);
      wrongAnswer();
      return;
    }
    if (isSoundEnabled) {
      correctSound();
    }

    setQueAns(null);
    setLevelTimer(cuLevelTimer);
    setScore(score + 2);
    getQuestion();
  };
  const logout = (): void => {
    if (isSoundEnabled) {
      exitSound();
    }

    localStorage.clear();
    history.replace("/login");
  };

  const header = (
    <div className="game-header">
      <div className="game-header-title">
        <h5>Level {level}</h5>
        <h5>#{userDetail?.user?.userName}</h5>
      </div>
      <div className="game-header-btn">
        <Button
          label="New Game"
          className="p-button-success"
          onClick={confirm}
        />
        <Button label="Logout" className="p-button-danger" onClick={logout} />
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <ConfirmDialog />
      <div className="game-container">
        <Card header={header}>
          {livesCount > 0 ? (
            <div className="grid">
              <div className="row">
                <div className="col-8 md-8 lg-8 sm-8">
                  <div className="grid">
                    <div className="col-12 md:col-12 lg:col-12 sm:col-12">
                      <div className="question-img-wrapper">
                        <img
                          src={queAns?.question}
                          alt="question"
                          className="question-img"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="col-12 md:col-8 lg:col-8 sm:col-12">
                      <div className="grid">
                        {answerArray.map((value: number) => (
                          <div
                            className="col-12 md:col-2 lg:col-2 sm:col-4"
                            key={value}
                            onClick={() => btnClick(value)}
                          >
                            <Button
                              disabled={isDisabled}
                              label={value + ""}
                              className="p-button-secondary"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4 md-4 lg-4 sm-4">
                  <div className="flex p-2">
                    <h4 style={{ flex: 1 }}>Time Ends </h4>
                    <h3
                      className={
                        levelTimer > 5 ? "text-success" : "text-danger"
                      }
                    >
                      {" "}
                      {levelTimer}sec
                    </h3>
                  </div>
                  <div className="flex p-2 mt-4">
                    <h4 style={{ flex: 1 }}>Lives </h4>
                    <h3> {livesCount}</h3>
                  </div>
                  <div className="flex p-2 mt-4">
                    <h4 style={{ flex: 1 }}>Points </h4>
                    <h3> {score}</h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="game-over">
              <div className="game-over-title">
                {!hasFinished ? (
                  <h5>Game Over</h5>
                ) : (
                  <h5>All Levels Completed!!</h5>
                )}
                <h5>My HighScore {userDetail?.board?.highScore}</h5>
                <h5>My Score {myScore}</h5>
                <Button
                  label="Play Again"
                  onClick={() => {
                    history.push("/dashboard");
                  }}
                />
              </div>
              <div>
                <div className="grid table-custom">
                  <div className="col-12 md:col-6 lg:col-6 sm:col-12">
                    <h5>#HighScores</h5>
                    <DataTable
                      value={highScoreDetail}
                      responsiveLayout="scroll"
                    >
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
              </div>
            </div>
          )}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Game;
