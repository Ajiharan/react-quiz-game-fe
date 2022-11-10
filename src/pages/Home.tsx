import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import "./home.scss";
const Home = () => {
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    // axios.get("/score");
  }, []);
  return (
    <React.Fragment>
      <div className='home-container'>
        <Card title='Welcome to quiz game' subTitle='Quiz Game '>
          <div className='home-button-grp'>
            <Button label='Start Game' className='p-button-success' />
            <Button
              label='HighScore'
              className='p-button-secondary'
              onClick={() => setViewDialog(true)}
            />
          </div>
        </Card>
      </div>
      <Dialog
        header='Header Text'
        visible={viewDialog}
        style={{ width: "50vw" }}
        modal
        onHide={() => setViewDialog(false)}
      >
        Content
      </Dialog>
    </React.Fragment>
  );
};

export default Home;
