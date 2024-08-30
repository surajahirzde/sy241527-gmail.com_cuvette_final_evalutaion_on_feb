import { useEffect, useMemo, useState } from "react";
import Button from "../Utils/Button";
import "./styles/Homepage.css";
import Notification from "../Utils/Notification";
import { setCookie } from "../helper/mainFunction";
import { useNavigate } from "react-router-dom";
import Loader from "../helper/Loader";

const Homepage = () => {
  const [activeLeft, setActiveLeft] = useState(true);
  const [activeRight, setActiveRight] = useState(false);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState();
  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Name is required";
    } else if (values.name.length < 3) {
      errors.name = "Name must be at least 3 characters";
    } else if (values.name.length > 20) {
      errors.name = "Name cannot exceed more than 20 characters";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,20}$/.test(
        values.password
      )
    ) {
      errors.password = "Password is weak";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (values.password.length > 20) {
      errors.password = "Password cannot exceed more than 20 characters";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    } else if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    }
    return errors;
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => {
      return { ...pre, [name]: value };
    });
    setErrors((pre) => {
      return { ...pre, [name]: "" };
    });
  };

  useEffect(() => {
    if (activeLeft) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
    if (activeRight) {
      setFormData({
        email: "",
        password: "",
      });
    }
  }, [activeLeft, activeRight]);

  const submitData = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const errors = validate(formData);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        data.code === 201 ? setActiveLeft(false) : setActiveRight(false);
        data.code === 201 ? setMsg(data.message) : setMsg("");
        setTimeout(() => {
          setMsg("");
          setActiveRight(true);
        }, 3000);
        // Handle successful registration (redirect to login or dashboard)
      } else {
        console.log("Registration error:", data);
        setMsg(data.message);
        setTimeout(() => {
          setMsg("");
        }, 3000);
        // Handle registration error (e.g., display error message)
      }
    } catch (error) {
      console.error("Error:", error);
      setMsg(error.message);
      setTimeout(() => {
        setMsg("");
      }, 3000);
    }
    setIsLoading(false);
  };
  const loginData = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // set cookie
        if (data.code === 200) {
          setMsg(data.message);
          setTimeout(() => {
            setMsg("");
            navigate("/admin");
          }, 3000);
          setCookie("token", data.token, 1);
          setActiveLeft(false);
          setActiveRight(false);
        }
        // Handle successful login
      } else {
        if (data.code === 400) {
          setMsg(data.message);
          setTimeout(() => {
            setMsg("");
          }, 3000);
        }
        console.log("Login error:", data);
        // Handle login error
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };
  const notificationMsg = useMemo(() => {
    return <Notification text={msg} func={() => setMsg("")} />;
  }, [msg]);
  return (
    <main className="homepage">
      <div className="container">
        <h1>QUIZZIE</h1>
        <div className="btnContainer">
          <Button
            activeClass={activeLeft ? "active" : ""}
            btnType={"left"}
            text={"sign up"}
            func={() => {
              setActiveLeft(true);
              setActiveRight(false);
            }}
          />
          <Button
            activeClass={activeRight ? "active" : ""}
            text={"login"}
            btnType={"right"}
            func={() => {
              setActiveRight(true);
              setActiveLeft(false);
            }}
          />
        </div>
        <div className="formContainer">
          {activeLeft && (
            <div className="signUpForm">
              <form onSubmit={submitData}>
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoFocus={true}
                    onChange={handleInputChange}
                  />
                  {errors.name && (
                    <p
                      className="error"
                      onClick={() =>
                        setErrors((pre) => {
                          return { ...pre, name: "" };
                        })
                      }
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p
                      className="error"
                      onClick={() =>
                        setErrors((pre) => {
                          return { ...pre, email: "" };
                        })
                      }
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type={errors.password ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p
                      className="error"
                      onClick={() =>
                        setErrors((pre) => {
                          return { ...pre, password: "" };
                        })
                      }
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type={errors.confirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && (
                    <p
                      className="error"
                      onClick={() =>
                        setErrors((pre) => {
                          return { ...pre, confirmPassword: "" };
                        })
                      }
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <Button
                  type={"submit"}
                  text={"sign up"}
                  activeClass={"btn"}
                  btnType={"btn"}
                />
              </form>
            </div>
          )}
          {activeRight && (
            <div className="loginForm">
              <form onSubmit={loginData}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    name="email"
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p
                      className="error"
                      onClick={() =>
                        setErrors((pre) => {
                          return { ...pre, email: "" };
                        })
                      }
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p
                      className="error"
                      onClick={() =>
                        setErrors((pre) => {
                          return { ...pre, password: "" };
                        })
                      }
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
                <Button
                  type={"submit"}
                  text={"login"}
                  activeClass={"btn"}
                  btnType={"btn"}
                />
              </form>
            </div>
          )}
        </div>
        {msg.length > 0 && notificationMsg}
        {isLoading && <Loader />}
      </div>
    </main>
  );
};

export default Homepage;
