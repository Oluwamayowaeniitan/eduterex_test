import React, { useState, useContext } from "react";
import "./Signin.css";
import { FiMail, FiLock } from "react-icons/fi";
import { AlertBadge } from "../../components/AlertBadge";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import from context
import Loading from "../../utils/Loader";
import { loginUser } from "../../services/authService"; // Use loginUser function from authService
import { useSchool } from "../../context/SchoolContext";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    member: "Staff",
  });
  const { login } = useContext(AuthContext);
  const { setSchoolDatas } = useSchool();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toTitleCase = (str) => {
    return str.toLowerCase().replace(/(?:^|\s|-)\w/g, function (match) {
      return match.toUpperCase();
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const isNullOrEmpty = (value) =>
      value === null || value === undefined || value === "";

    const body = {
      email: formData.email,
      password: formData.password,
      member: formData.member,
    };

    for (const key in body) {
      if (body.hasOwnProperty(key) && isNullOrEmpty(body[key])) {
        setMessage(
          `${toTitleCase(key.replaceAll("_", " "))} cannot be blank or empty`,
        );
        setLoading(false);
        return null;
      }
    }

    try {
      const response = await loginUser(body);
      // If login is successful, set user data in AuthContext and navigate
      if (response.success) {
        login(response.user, response.tokens);
        setSchoolDatas(response.schoolData);
        navigate("/", { replace: true });
      } else {
        setMessage(response.message || "Login failed");
      }
    } catch (error) {
      setLoading(false);
      setMessage(error);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="onboarding-title">
          <h3>Staff Login</h3>
          <p>Staff should login with their email and password.</p>
        </div>
        {message && <AlertBadge message={message} />}
        <div className="input-form-container">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
          />
          <div className="form-icons">
            <FiMail className="icons" />
          </div>
        </div>

        <div className="input-form-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create Password"
          />
          <div className="form-icons">
            <FiLock className="icons" />
          </div>
        </div>
        <div className="signin-page-action">
          <Link>Student Login</Link>
          <Link>Forgot Password</Link>
        </div>
        <div className="btn-container">
          <button className="btn" onClick={handleSubmit}>
            {loading ? <Loading /> : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
