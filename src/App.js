import "./App.css";
import { useState, useEffect } from "react";
import About from "./components/About";
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";
import toastr from "toastr";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

function App() {
  let [Mode, setMode] = useState("light");
  let [alert, setAlert] = useState({});
  let [nightTheme, setNightTheme] = useState("#02243E");

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

  return (
    <>
      {/* <div data-bs-theme={Mode}>
              <Navbar
                title="TextUtils"
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
                <TextForm
                showAlert={showAlert}
                heading="Enter the text to analyse"
              />
              </div>
              
            </div>
             */}

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div data-bs-theme={Mode}>
                <Navbar
                  title="TextUtils"
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
                  heading="Try TextUtility - Word Counter, Character Counter, Remove Extra Spaces"
                />
              }
            />
            <Route
              path="about"
              element={<About accordionStyle={accordionStyle} />}
            />
            <Route path="/about/us" element={<div>Wooohoooo</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
