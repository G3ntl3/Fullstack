import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import the CSS

const Signup = () => {
  const navigate = useNavigate();

  // ✅ Notification function
  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

  const notifyError = (message) =>
    toast.error(message || "Signup failed", {
      position: "top-right",
      autoClose: 5000,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      fullname: yup.string().required("Full name is required"),
      email: yup.string().email("Invalid email").required("Email is required"),
      password: yup
        .string()
        .min(8, "Min 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const result = await axios.post("http://localhost:8000/signup", values);
        console.log(result);
        notifySuccess(result.data.message); 
        
        setTimeout(() => {
          navigate("/login");
        }, 2000); 
      } catch (err) {
        console.log(err);
        notifyError(err?.response?.data?.message);
      }
    },
  });

  return (
    <div>
  
      <ToastContainer />

      <form method="POST" onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="fullname"
          placeholder="Enter Fullname"
          value={formik.values.fullname}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <br />
        {formik.touched.fullname && formik.errors.fullname && (
          <span>{formik.errors.fullname}</span>
        )}
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        <br />
        {formik.touched.email && formik.errors.email && (
          <span>{formik.errors.email}</span>
        )}
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter a strong password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        <br />
        {formik.touched.password && formik.errors.password && (
          <span>{formik.errors.password}</span>
        )}
        <br />

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
