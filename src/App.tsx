import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import Game from "./pages/game/Game";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const toast = useRef<any>(null);

  return (
    <div className="App">
      <Toast ref={toast} />
      <Router>
        <Switch>
          <Route path="/login" component={() => <Login toast={toast} />} />
          <Route path="/register" component={() => <Signup toast={toast} />} />
          <ProtectedRoute
            path="/dashboard"
            component={() => <Dashboard toast={toast} />}
          />
          <ProtectedRoute
            path="/game"
            component={() => <Game toast={toast} />}
          />
          <Route path="" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
