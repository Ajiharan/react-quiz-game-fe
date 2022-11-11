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

const Login = (props: any) => {
  const history = useHistory();
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

  return (
    <div className="form-demo">
      <div className="signIn-container">
        <Card>
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">SignIn Account</h5>
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
