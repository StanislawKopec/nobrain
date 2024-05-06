import React from 'react';
import axios from 'axios';
import * as yup from "yup";
import "./Register.scss";
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const checkRegister = (username: string, password: string, formik: any, navigate: any, dispatch: any) => {
  axios
    .post(`${BASE_URL}/api/Login/register`, {
      username: username,
      password: password,
    })
    .then((response) => {
      alert("User created successfully");
      formik.resetForm();
      navigate("/login");
    })
    .catch((error) => {
      alert("User already exists");
      console.log(error);
    });
};

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/home");
  };

  const handleNavigateLoginClick = () => {
    navigate("/login");
  };

  const onSubmit = async (values: any, actions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    checkRegister(values.username, values.password, formik, navigate, dispatch);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: basicSchema, // Use your validation schema here
    onSubmit,
  });

  return (
    <div className="container-main-register">
      <div className="container-content">
        <div className="login-register">
          <h2>Register</h2>
          <button
            className="login-btn"
            onClick={handleNavigateLoginClick}
            disabled={formik.isSubmitting}
          >
            Login
          </button>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          className="form-register"
        >
          <label htmlFor="email">Email</label>
          <input
            value={formik.values.email}
            onChange={formik.handleChange}
            id="email"
            type="email"
            placeholder="Enter your email"
            onBlur={formik.handleBlur}
            className={
              formik.errors.email && formik.touched.email ? "input-error" : ""
            }
          />
          {formik.errors.email && formik.touched.email && (
            <p className="error">{formik.errors.email}</p>
          )}

          <label htmlFor="username">Username</label>
          <input
            value={formik.values.username}
            onChange={formik.handleChange}
            id="username"
            type="text"
            placeholder="Enter your Username"
            onBlur={formik.handleBlur}
            className={
              formik.errors.username && formik.touched.username
                ? "input-error"
                : ""
            }
          />
          {formik.errors.username && formik.touched.username && (
            <p className="error">{formik.errors.username}</p>
          )}

          <label htmlFor="password">Password</label>
          <input
            value={formik.values.password}
            onChange={formik.handleChange}
            id="password"
            type="password"
            placeholder="Enter your Password"
            onBlur={formik.handleBlur}
            className={
              formik.errors.password && formik.touched.password
                ? "input-error"
                : ""
            }
          />
          {formik.errors.password && formik.touched.password && (
            <p className="error">{formik.errors.password}</p>
          )}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onBlur={formik.handleBlur}
            className={
              formik.errors.confirmPassword && formik.touched.confirmPassword
                ? "input-error"
                : ""
            }
          />
          <label style={{height: '10px'}}></label>
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <p className="error">{formik.errors.confirmPassword}</p>
          )}
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
  )
};

export default Register;

//const passwordRules =  /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/;
const basicSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Required"),
    username: yup.string().min(6).required("Required"),
    password: yup
      .string()
      .min(6)
      //.matches(passwordRules, { message: "Create stronger password" })
      .required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords don't match")
      .required("Required"),
  });