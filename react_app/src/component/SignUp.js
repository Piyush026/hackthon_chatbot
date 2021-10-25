import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import validator from "validator";
import { useHistory } from "react-router-dom";

const apiServer = `${process.env.REACT_APP_CONFIG_API_SERVER}`;

const SignUp = () => {
  const history = useHistory();
  const [userRegistration, setUserRegistration] = useState({
    username: "",
    email: "",
    password: "",
    occupation: "",
    address: "",
  });

  const [isValid, setValid] = useState(false);
  const [response, setResponse] = useState({ ok: null, message: null });
  const [showPass, setShowPass] = useState(false);
  // const [userInfo,setUserInfo] = useState([])

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserRegistration({ ...userRegistration, [name]: value });
  };

  const handlePassClick = (e) => {
    e.preventDefault();
    if (showPass === true) setShowPass(false);
    else setShowPass(true);
  };

  function handleError(status) {
    console.error(`Got HTTP Error ${status}`);
    alert("Please try after some time");
  }

  async function handleUserExists(fetchResponse) {
    const data = await fetchResponse.json();
    if (data.detail === "REGISTER_USER_ALREADY_EXISTS") {
      setResponse({ ...response, message: "User or Email already exists" });
    }
  }

  const fetchData = async () => {
    console.info(userRegistration);

    try {
      const fetchResponse = await fetch(apiServer + "/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userRegistration),
      });

      async function handleSuccess(fetchResponse) {
        const data = await fetchResponse.json();
        console.log("Data>>>>>>>>>>>", data);

        if ("id" in data) {
          setResponse({ ...response, ok: true });
          history.push({
            state: { userRegistrationEmail: userRegistration.email },
            pathname: "/login",
          });
        }
      }

      switch (fetchResponse.status) {
        case 201:
          return await handleSuccess(fetchResponse);
        case 400:
          return handleUserExists(fetchResponse);
        default:
          return handleError(fetchResponse);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let error = "";
    if (
      !userRegistration.email &&
      !userRegistration.password &&
      !userRegistration.name
    ) {
      setUserRegistration({
        ...userRegistration,
        error: "Name, Email and Password cannot be blank!",
      });
      alert("Name, Email and Password cannot be blank!");
    } else {
      setValid(true);
      setUserRegistration({ ...userRegistration, error: "" });
    }
    if (!userRegistration.email || !validator.isEmail(userRegistration.email)) {
      error += "Email, ";
      setValid(false);
    }
    if (
      !userRegistration.password ||
      !validator.isStrongPassword(userRegistration.password, {
        minLength: 8,
        minLowercase: 1,
        maxlength: 50,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      error += "Password ";
      setValid(false);
    }
    setUserRegistration({ ...userRegistration, error: error });

    if (error) {
      setResponse({ ...response, message: error + "Invalid" });
    } else {
      fetchData();
    }
  };
  return (
    <body>
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <div className="form">
          {/*<div className="title">Welcome</div>*/}
          <div className="subtitle">Let's find new Friends</div>
          <div className="input-container ic2">
            {/*<input id="firstname" className="input" type="text" placeholder=" "/>*/}
            <input
              type="email"
              className="input"
              autoComplete="off"
              value={userRegistration.email}
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
            {/*<input id="firstname" className="input" type="text" placeholder=" "/>*/}
            <input
              type="text"
              className="input"
              autoComplete="off"
              value={userRegistration.occupation}
              onChange={handleInput}
              onInput={handleInput}
              name="occupation"
              id="occupation"
              required
            />
            <div className="cut" />
            <label htmlFor="occupation" className="placeholder">
              Occupation
            </label>
          </div>
          <div className="input-container ic2">
            {/*<input id="firstname" className="input" type="text" placeholder=" "/>*/}
            <input
              type="text"
              className="input"
              autoComplete="off"
              value={userRegistration.address}
              onChange={handleInput}
              onInput={handleInput}
              name="address"
              id="address"
              required
            />
            <div className="cut" />
            <label htmlFor="address" className="placeholder">
              Address
            </label>
          </div>
          <div className="input-container ic2">
            <input
              type={showPass ? "text" : "password"}
              className="input"
              autoComplete="off"
              value={userRegistration.password}
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

export default SignUp;
