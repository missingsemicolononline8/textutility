import React from "react";

function Keyword({ keyword, highlightKeyWord }) {
  return (
    <li
      style={{ listStyleType: "none", cursor: "pointer" }}
      className="border-bottom border-1 py-1"
      onClick={highlightKeyWord}
    >
      <span
        className="badge bg-secondary px-2 py-1 rounded-pill float-end"
        style={{ marginTop: "2px" }}
      >
        {keyword.count}
        {"  "}({keyword.density}%)
      </span>
      {keyword.keyword}
    </li>
  );
}

export default Keyword;
