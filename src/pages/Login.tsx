import React from "react";
import "./Login.scss";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../store/auth-slice";
import { BASE_URL } from "../config";

const basicSchema = yup.object().shape({
  username: yup.string().min(6).required("Required"),
  password: yup.string().min(6).required("Required"),
});

const checkLogin = async (username: string, password: string, formik: any, navigate: any, dispatch: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/Login/${username}/${password}`);
    dispatch(authActions.login(response.data));
    formik.resetForm();
    navigate("/home");
  } catch (error) {
    alert("Wrong Username or Password");
    console.error(error);
  }
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const onSubmit = async (values: any, actions: any) => {
    checkLogin(values.username, values.password, formik, navigate, dispatch);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: basicSchema,
    onSubmit,
  });

  return (
    <div className="container-main-login">
      <div className="container-content">
        <div className="login-register">
          <h2>Login</h2>
          <button
            className="register-btn"
            onClick={handleRegisterClick}
            disabled={formik.isSubmitting}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          className="form-login"
        >
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            //error={formik.touched.password && Boolean(formik.errors.password)}
            //helperText={formik.touched.password && formik.errors.password}
          />
          <label></label>
          <button
            className="submit-btn"
            disabled={formik.isSubmitting}
            type="submit"
          >
            Submit
          </button>
          <button
            className="back-btn"
            onClick={handleBackClick}

            disabled={formik.isSubmitting}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
