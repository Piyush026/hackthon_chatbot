import React, { useState } from "react";
import "../style.css";
import "../login.css";
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import validator from "validator";
import axios from "axios";
const apiServer = `${process.env.REACT_APP_CONFIG_API_SERVER}`;

const Login = () => {
  const history = useHistory();
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
    error: "",
  });

  const [isValid, setValid] = useState(false);
  const [response, setResponse] = useState({ ok: null, message: null });
  const [showPass, setShowPass] = useState(false);
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserLogin({ ...userLogin, [name]: value });
  };

  function handleError(status) {
    console.error(`Got HTTP Error ${status}`);
    alert(status);
  }

  function handleUnAuthorized(response = null) {
    console.log("User is UnAuthorized");
    alert("Please Logout and LogIn Again");
  }

  const formData = new FormData();
  formData.set("username", userLogin.email);
  formData.set("password", userLogin.password);

  const fetchData = async () => {
    try {
      const fetchResponse = await axios.post(
        apiServer + "/auth/jwt/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      async function handleSuccess(fetchResponse) {
        let json_res = await fetchResponse.data;
        console.log("json_res", json_res);
        try {
          const userStatusResponse = await axios.get(apiServer + "/users/me", {
            headers: {
              Authorization: `Bearer ${json_res.access_token}`,
            },
          });

          async function handleUserSuccess() {
            const userStatus = await userStatusResponse;
            console.log("userStatus>>>>>>>>", userStatus);

            setResponse({ ...response, ok: true });
            Cookies.set("user_email", userLogin.email, { expires: 0.08 });
            Cookies.set("user_id", userStatus.data.occupation);
            Cookies.set("user_token", json_res.access_token, {
              expires: 0.08,
            });
            history.push({
              pathname: "/chat",
            });
          }

          switch (userStatusResponse.status) {
            case 200:
              return await handleUserSuccess(userStatusResponse);
            case 401:
              return handleUnAuthorized(userStatusResponse);
            default:
              return handleError(userStatusResponse);
          }
        } catch (err) {
          handleError(err);
        }
      }

      switch (fetchResponse.status) {
        case 200:
          return await handleSuccess(fetchResponse);
        case 401:
          return handleUnAuthorized(fetchResponse);
        default:
          return handleError(fetchResponse);
      }
    } catch (err) {
      handleError(err);
      setResponse({ ...response, message: "user not found" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userLogin.email || !userLogin.password) {
      setUserLogin({
        ...userLogin,
        error: "Email and Password cannot be blank!",
      });
      alert("Email and Password cannot be blank!");
    } else {
      setValid(true);
      setUserLogin({ ...userLogin, error: "" });
    }
    if (!validator.isEmail(userLogin.email)) {
      setUserLogin({ ...userLogin, error: "Invalid Email" });
      setValid(false);
      // alert("Invalid Email");
    }
    if (
      !validator.isStrongPassword(userLogin.password, {
        minLength: 8,
        minLowercase: 1,
        maxlength: 50,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setUserLogin({ ...userLogin, error: "Invalid Password" });
      setValid(false);
      // alert("Invalid Password!");
    }

    fetchData();
  };

  return (
    <body>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="form">
          <div className="title">Welcome</div>
          <div className="subtitle">Let's find new Friends</div>
          <div className="input-container ic1">
            {/*<input id="firstname" className="input" type="text" placeholder=" "/>*/}
            <input
              type="email"
              className="input"
              autoComplete="off"
              value={userLogin.email}
              onChange={handleInput}
              onInput={handleInput}
              name="email"
              id="email"
              required
            />
            <div className="cut" />
            <label htmlFor="email" className="placeholder">
              Email
            </label>
          </div>
          <div className="input-container ic2">
            <input
              type={showPass ? "text" : "password"}
              className="input"
              autoComplete="off"
              value={userLogin.password}
              onChange={handleInput}
              onInput={handleInput}
              name="password"
              id="password"
              required
            />
            <div className="cut" />
            <label htmlFor="password" className="placeholder">
              Password
            </label>
          </div>
          <button type="text" className="submit">
            submit
          </button>
        </div>
      </form>
    </body>
  );
};

export default Login;
