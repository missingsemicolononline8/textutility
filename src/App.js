import { useState } from "react";
import "./App.css";
import About from "./components/About";
import Navbar from "./components/Navbar";
import TextForm from "./components/TextForm";

function App() {
  let [darkMode, setDarkMode] = useState(false);

  function changeMode(e) {
    setDarkMode(!darkMode);
  }

  let accordionStyle = darkMode
    ? {
        border: "1px solid white",
        borderRadius: "0",
      }
    : null;

  let modeButtonText = darkMode ? "Light" : "Dark";

  let modeButtonClass = darkMode ? "btn-dark" : "btn-light";
  return (
    <>
      <Navbar title="TextUtils" aboutText="About Us" />
      <div className={"py-4 w-100 min-vh-100 " + (darkMode ? "darkMode" : "")}>
        {/* <About accordionStyle={accordionStyle} /> */}
        <TextForm heading="Enter the text to analyse" />
        <div className="container my-4">
          <button className={"btn " + modeButtonClass} onClick={changeMode}>
            Enable {modeButtonText} Mode
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
