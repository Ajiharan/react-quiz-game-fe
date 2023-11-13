import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import "./signup.scss";
import { Card } from "primereact/card";
import { Link, useHistory } from "react-router-dom";
import axios from "../../api/Axios";
import useSound from "use-sound";
import click1 from "../../assets/click1.wav";
import wrongSound from "../../assets/wrong2.mp3";
import { useAppSelector } from "../../state/hook/stateHook";
import { soundEnabled, soundVolume } from "../../state/sound/soundSlice";
const Signup = (props: any) => {
  const volume = useAppSelector(soundVolume);
  const isSoundEnabled = useAppSelector(soundEnabled);
  const [playButton] = useSound(click1, { volume });
  const [playError] = useSound(wrongSound, { volume });
  const history = useHistory();
  const formik: any = useFormik({
    initialValues: {
      userName: "",
      password: "",
      confirmPassword: "",
    },
    validate: (data: any) => {
      let errors: any = {};

      if (!data.userName) {
        errors.userName = "userName is required.";
      }

      if (!data.password) {
        errors.password = "Password is required.";
      }
      if (!data.confirmPassword) {
        errors.confirmPassword = "Password is required.";
      } else if (data.confirmPassword !== data.password) {
        errors.confirmPassword = "Password didn't match";
      }

      return errors;
    },
    onSubmit: (data: any) => {
      createUser(data);
    },
  });

  const createUser = (data: any): void => {
    axios
      .post("/user/register", data)
      .then((res: any) => {
        if (isSoundEnabled) {
          playButton();
        }

        history.push("/login");
        props.toast.current.show({
          severity: "success",
          summary: "Success Message",
          detail: "Registered Successfully",
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

  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );

  return (
    <div className="form-demo">
      <div className="signIn-container">
        <Card>
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">Register Account</h5>
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
                      Username*
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
                      header={passwordHeader}
                      footer={passwordFooter}
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
                <div className="field">
                  <span className="p-float-label">
                    <Password
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      toggleMask
                      className={classNames({
                        "p-invalid": isFormFieldValid("confirmPassword"),
                      })}
                    />
                    <label
                      htmlFor="confirmPassword"
                      className={classNames({
                        "p-error": isFormFieldValid("confirmPassword"),
                      })}
                    >
                      Confirm password*
                    </label>
                  </span>
                  {getFormErrorMessage("confirmPassword")}
                </div>

                <Button type="submit" label="Submit" className="mt-2" />
                <div className="signIn-footer">
                  <p>If you already an account</p>
                  <Link to={"/login"}>SignIn account</Link>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
