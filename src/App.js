import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import About from "./components/About";
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm/TextForm";
import toastr from "toastr";
import { Routes, Route, Outlet } from "react-router-dom";
import ReactGA from 'react-ga4';

//const TRACKING_ID = " <GA TRACKING ID> "; 

//ReactGA.initialize(TRACKING_ID);

function App() {
  let [Mode, setMode] = useState("light");
  let [alert, setAlert] = useState({});
  let [nightTheme, setNightTheme] = useState("#032B11");


  let accordionStyle =
    Mode === "dark"
      ? {
          border: "1px solid white",
          borderRadius: "0",
        }
      : null;

  let reverseMode = Mode === "dark" ? "light" : "dark";

  function changeMode() {
    setMode(reverseMode);
  }

  function showAlert(msg, type) {
    let newAlert = {
      message: msg,
      type,
    };

    setAlert(newAlert);
  }

  useEffect(() => {
    if (alert.type !== undefined) {
      toastr[alert.type](alert.message, null, {
        timeOut: 2000,
        progressBar: true,
      });

      setAlert({});
    }
  }, [alert]);

  /* useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search});
  }, []); */

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div data-bs-theme={Mode}>
              <Navbar
                title="Text Utils"
                aboutText="About Us"
                mode={Mode}
                revMode={reverseMode}
                toggleMode={changeMode}
                setNightTheme={setNightTheme}
              />
              <div
                className={`py-4 w-100 min-vh-100 ${
                  Mode !== "light" && "darkMode"
                }`}
                style={{ "--color": nightTheme }}
              >
                <Outlet />
              </div>
            </div>
          }
        >
          <Route
            index
            element={
              <TextForm
                showAlert={showAlert}
                heading="Add some text to analyse"
                revMode={reverseMode}
              />
            }
          />
          <Route
            path="about"
            element={<About accordionStyle={accordionStyle} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
