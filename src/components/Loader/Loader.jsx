import React from "react";
import "./Loader.css";

function Loader({ loaderText }) {
  return (
    <div className="h-100 w-100 d-flex justify-content-center align-items-center gap-2">
      <span>{loaderText} </span>
      <div className="custom-loader"></div>
    </div>
  );
}

export default Loader;
