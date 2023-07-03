import React, { useState } from "react";

export default function TextForm(props) {
  let [text, setText] = useState("");
  let [result, setResult] = useState("");

  function handleChangeText(e) {
    setText(e.target.value);
  }

  function handleUpClick(e) {
    let newText = text.toUpperCase();
    setResult(newText);
  }

  function handleLowClick(e) {
    let newText = text.toLowerCase();
    setResult(newText);
  }

  function handleAlternateClick(e) {
    let newText = text.toLowerCase().split("");
    for (let i = 0; i < newText.length; i += 2) {
      newText[i] = newText[i].toUpperCase();
    }
    setResult(newText.join(""));
  }

  function handleTitleClick() {
    let paragraphs = text.split("\n");
    let newText = paragraphs
      .map((paragraph) => {
        return paragraph
          .split(" ")
          .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          })
          .join(" ");
      })
      .join("\n");

    setResult(newText);
  }

  function handleSentenceClick() {
    let paragraphs = text.split("\n");
    let newText = paragraphs
      .map((paragraph) => {
        return paragraph
          .toLowerCase()
          .split(". ")
          .map((sentence) => {
            return sentence.charAt(0).toUpperCase() + sentence.slice(1);
          })
          .join(". ");
      })
      .join("\n");

    setResult(newText);
  }

  function handleInverseClick() {
    let chars = text.split("");
    let newText = chars
      .map((ch) => {
        if (ch === ch.toUpperCase()) {
          return ch.toLowerCase();
        } else {
          return ch.toUpperCase();
        }
      })
      .join("");
    setResult(newText);
  }

  function handleClearClick(e) {
    setResult("");
    setText("");
  }

  function handleEditClick() {
    setText(result);
  }

  function handleCopyClick() {
    navigator.clipboard.writeText(result);
    props.showAlert("Copied to Clipboard", "success");
  }

  function handleReadClick(e) {
    if (text.length) {
      let speech = new SpeechSynthesisUtterance();
      speech.text = text;
      window.speechSynthesis.speak(speech);
    } else props.showAlert("Nothing to read", "warning");
  }

  let preview = result && (
    <>
      <h2>Result</h2>
      <p
        style={{ whiteSpace: "pre-wrap" }}
        className="text-break position-relative"
      >
        <button
          className="btn d-flex align-items-center gap-2 position-absolute p-0"
          style={{ top: "-36px", right: "80px" }}
          onClick={handleEditClick}
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          Edit
        </button>
        <button
          className="btn d-flex align-items-center gap-2 position-absolute p-0"
          style={{ top: "-36px", right: 0 }}
          onClick={handleCopyClick}
        >
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          Copy
        </button>
        {result}
      </p>
    </>
  );

  let wordCount = text.split(/\s+/).filter((el) => el.length!==0);

  return (
    <>
      <div className="container">
        <h1 className="my-5">{props.heading}</h1>
        <div className="mb-3">
          <textarea
            className="form-control"
            id="myBox"
            rows="8"
            onChange={handleChangeText}
            placeholder="Enter Text Here..."
            value={text}
          ></textarea>
        </div>
        <button disabled={text.length===0} className="btn btn-primary" onClick={handleUpClick}>
          Uppercase
        </button>
        <button disabled={text.length===0} className="btn btn-warning ms-3" onClick={handleLowClick}>
          Lowercase
        </button>
        <button disabled={text.length===0} className="btn btn-success ms-3" onClick={handleAlternateClick}>
          Alternate Case
        </button>
        <button disabled={text.length===0} className="btn btn-light ms-3" onClick={handleTitleClick}>
          Title Case
        </button>
        <button disabled={text.length===0} className="btn btn-dark ms-3" onClick={handleSentenceClick}>
          Sentence Case
        </button>
        <button disabled={text.length===0} className="btn btn-info ms-3" onClick={handleInverseClick}>
          Inverse Case
        </button>
        <button disabled={text.length===0} className="btn btn-danger ms-3" onClick={handleClearClick}>
          Clear
        </button>
        <button disabled={text.length===0} className="btn btn-link ms-3" onClick={handleReadClick}>
          Read
        </button>
      </div>
      <div className="container my-2">
        <h2>Your text summary</h2>
        <p>
          {wordCount.length} words, {text ? text.length : 0} characters
        </p>
        <p>{Math.floor((text ? text.split(" ").length : 0) * 0.008)} Minutes</p>
        {preview}
      </div>
    </>
  );
}
