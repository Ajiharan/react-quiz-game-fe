import React, { useState } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import "./login.scss";
import { Card } from "primereact/card";
import { Link, useHistory } from "react-router-dom";
import axios from "../../api/Axios";
import useSound from "use-sound";
import click1 from "../../assets/click1.wav";
import wrongSound from "../../assets/wrong2.mp3";
import { useAppSelector } from "../../state/hook/stateHook";
import { soundEnabled, soundVolume } from "../../state/sound/soundSlice";
import { MyComponentBuilder } from "../../builder/builder";
import { styleSelector } from "../../state/style/styleSlice";

const builder = MyComponentBuilder();

const Login = (props: any) => {
  const volume = useAppSelector(soundVolume);
  const isSoundEnabled = useAppSelector(soundEnabled);
  const styleConfig = useAppSelector(styleSelector);
  const [playButton] = useSound(click1, { volume });
  const [playError] = useSound(wrongSound, { volume });
  const history = useHistory();

  const signinTitle = builder
    .withText("SignIn Account")
    .withColor(styleConfig.color)
    .withSize(styleConfig.size)
    .build();

  const formik: any = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validate: (data: any) => {
      let errors: any = {};

      if (!data.userName) {
        errors.userName = "Username is required.";
      }

      if (!data.password) {
        errors.password = "Password is required.";
      }

      return errors;
    },
    onSubmit: (data: any) => {
      loginUser(data);
    },
  });
  const loginUser = (data: any): void => {
    axios
      .post("/user/login", data)
      .then((res: any) => {
        if (isSoundEnabled) {
          playButton();
        }

        localStorage.setItem("quiz", res.data);
        history.push("/dashboard");
        props.toast.current.show({
          severity: "success",
          summary: "Success Message",
          detail: "Login Successfully",
          life: 3000,
        });
        formik.resetForm();
      })
      .catch((err) => {
        if (isSoundEnabled) {
          playError();
        }

        console.log("err", err);
        props.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: err?.response?.data,
          life: 3000,
        });
        formik.resetForm();
      });
  };

  const isFormFieldValid = (name: string) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name: string) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  const navigateToHome = (): void => {
    history.push("");
  };

  return (
    <div className="form-demo">
      <div className="signIn-container">
        <Card>
          <div className="flex justify-content-center">
            <div className="card">
              <div
                className="flex align-items-center"
                style={{ flexDirection: "column" }}
              >
                <Button
                  icon="pi pi-home"
                  className="p-button-sm p-button-rounded p-button-success "
                  aria-label="Bookmark"
                  onClick={navigateToHome}
                />
                {signinTitle}
              </div>

              <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="field">
                  <span className="p-float-label">
                    <InputText
                      id="userName"
                      name="userName"
                      value={formik.values.userName}
                      onChange={formik.handleChange}
                      autoFocus
                      className={classNames({
                        "p-invalid": isFormFieldValid("userName"),
                      })}
                    />
                    <label
                      htmlFor="userName"
                      className={classNames({
                        "p-error": isFormFieldValid("userName"),
                      })}
                    >
                      userName*
                    </label>
                  </span>
                  {getFormErrorMessage("userName")}
                </div>

                <div className="field">
                  <span className="p-float-label">
                    <Password
                      id="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      toggleMask
                      className={classNames({
                        "p-invalid": isFormFieldValid("password"),
                      })}
                    />
                    <label
                      htmlFor="password"
                      className={classNames({
                        "p-error": isFormFieldValid("password"),
                      })}
                    >
                      Password*
                    </label>
                  </span>
                  {getFormErrorMessage("password")}
                </div>

                <Button type="submit" label="Submit" className="mt-2" />
                <div className="signIn-footer">
                  <p>If you don't have any Account</p>
                  <Link to={"/register"}>Create an account</Link>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
