import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";


const Login = () => {
  const nav=useNavigate()
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(8).required(),
    }),
    onSubmit: async (values) => {
      try {
        const result = await axios.post("http://localhost:8000/login", values)
        
        nav('/dashboard')
        console.log(result.data);
        
      } catch (err) {
        console.
          log(err.message);
      }
    },
  })
  
  return (
    <>
      <form method="POST" onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        <br />
        {formik.touched.email && formik.errors.email ? (
          <span>{formik.errors.email}</span>
        ) : null}
        <br />
        <input
          type="Password"
          placeholder="Password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        <br />

        {formik.touched.password && formik.errors.password ? (
          <span>{formik.errors.password}</span>
        ) : null}
        <br />
        <button type="submit"> Login</button>
      </form>
    </>
  );
};

export default Login;
