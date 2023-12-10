import React, { useState, useEffect } from "react";
import Keywords from "../Keywords/Keywords";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  CompositeDecorator,
} from "draft-js";
import * as draftOperations from "../helper";
import "./Editor.css";
import "../../../node_modules/draft-js/dist/Draft.css";
import { MDBBtn } from "mdb-react-ui-kit";
import "./mdb.scss";

export default function TextForm(props) {
  const [textbox, setTextbox] = useState(EditorState.createEmpty());
  const [operativeText, setOperativeText] = useState("");
  const [selectionState, setSelectionState] = useState(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const ContentState = textbox.getCurrentContent();
    let selectionState = textbox.getSelection();
    let selectedText = draftOperations.getTextSelection(
      ContentState,
      selectionState
    );
    if (!selectedText) {
      selectionState = draftOperations.selectAll(textbox, ContentState);
      selectedText = ContentState.getPlainText();
    }

    setSelectionState(selectionState);
    setOperativeText(selectedText);
  }, [textbox]);

  useEffect(() => {
    setTimeout(() => {
      setTextbox(EditorState.createEmpty());
    }, 2000);
  }, []);

  const onEditorChange = (newState) => {
    setTextbox(
      EditorState.set(newState, { decorator: generateDecorator(null) })
    );
  };

  const generateDecorator = (highlightTerm) => {
    const regex = new RegExp(highlightTerm, "gi");
    return new CompositeDecorator([
      {
        strategy: (contentBlock, callback) => {
          if (highlightTerm !== "") {
            findWithRegex(regex, contentBlock, callback);
          }
        },
        component: SearchHighlight,
      },
    ]);
  };

  const findWithRegex = (regex, contentBlock, callback) => {
    const text = contentBlock.getText();
    let matchArr, start, end;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      end = start + matchArr[0].length;
      callback(start, end);
    }
  };

  const SearchHighlight = (props) => (
    <span className="highlight">{props.children}</span>
  );

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(textbox, command);

    if (newState) {
      setTextbox(newState);
      return "handled";
    }

    return "not-handled";
  };

  function highlightKeyWord(keyword) {
    setTextbox(
      EditorState.set(textbox, { decorator: generateDecorator(keyword) })
    );
  }

  function handleUpClick(e) {
    let uppercaseText;
    uppercaseText = operativeText.toUpperCase();
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      uppercaseText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleLowClick(e) {
    let lowercaseText;
    lowercaseText = operativeText.toLowerCase();
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      lowercaseText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleAlternateClick(e) {
    let alternateText;
    alternateText = operativeText.toLowerCase().split("");
    for (let i = 0; i < alternateText.length; i += 2) {
      alternateText[i] = alternateText[i].toUpperCase();
    }
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      alternateText.join(""),
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleTitleClick() {
    let regex = /[^\s().]+/g;
    let modifiedText = operativeText
      .toLowerCase()
      .replace(regex, function (match) {
        return match.charAt(0).toUpperCase() + match.slice(1);
      });
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      modifiedText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleSentenceClick() {
    let regex = /(^|\.\s+|\n+)([a-z])/gim;
    let modifiedText = operativeText
      .toLowerCase()
      .replace(regex, function (match) {
        return match.toUpperCase();
      });
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      modifiedText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleInverseClick() {
    let chars = operativeText.split("");
    let modifiedText = chars
      .map((ch) => {
        if (ch === ch.toUpperCase()) {
          return ch.toLowerCase();
        } else {
          return ch.toUpperCase();
        }
      })
      .join("");
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      modifiedText,
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleClearClick(e) {
    setTextbox(EditorState.createEmpty());
  }

  function handleEditClick() {
    setTextbox(result);
  }

  function handleCopyClick() {
    navigator.clipboard.writeText(result);
    props.showAlert("Copied to Clipboard", "success");
  }

  function handleReadClick(e) {
    // Check if speech synthesis is currently speaking
    if (window.speechSynthesis.speaking) {
      // If speaking, stop the speech
      window.speechSynthesis.cancel();
    } else {
      // If not speaking, proceed to read the text
      if (operativeText.length) {
        let speech = new SpeechSynthesisUtterance();
        speech.text = operativeText;
        window.speechSynthesis.speak(speech);
      } else {
        // Show an alert if there is nothing to read
        props.showAlert("Nothing to read", "warning");
      }
    }
  }
  

  let preview = result && (
    <>
      <h2>Result</h2>
      <p
        style={{ whiteSpace: "pre-wrap" }}
        className="text-break position-relative"
      >
        <button
          data-mdb-ripple-color="dark"
          className="btn-sm btn d-flex align-items-center gap-2 position-absolute p-0"
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
            className="h-4 w-4"
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
          data-mdb-ripple-color="dark"
          className="btn-sm btn d-flex align-items-center gap-2 position-absolute p-0"
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
            className="h-4 w-4"
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

  let wordCount = (operativeText.match(/[^\s]+/g) || []).length;

  return (
    <div className="container d-flex gap-5 align-items-stretch flex-wrap">
      <main style={{ flex: "11 0 0" }} className="material-element">
        <h1 className="my-3 fs-4">{props.heading}</h1>
        <div className="mb-3 position-relative">
          <Editor editorState={textbox} onChange={onEditorChange} id="myBox" />
        </div>

        <div className="text-controls d-flex flex-wrap gap-2">
        <MDBBtn
          size="sm"
          onClick={handleUpClick}
          disabled={operativeText.length === 0}
          outline
          rounded
        >
          Uppercase
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleLowClick}
          disabled={operativeText.length === 0}
          outline
          rounded
          color="secondary"
        >
          Lowercase
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleAlternateClick}
          disabled={operativeText.length === 0}
          outline
          rounded
          color="success"
        >
          Alternate Case
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleTitleClick}
          disabled={operativeText.length === 0}
          outline
          rounded
          color="danger"
        >
          Title Case
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleSentenceClick}
          disabled={operativeText.length === 0}
          outline
          rounded
          color="warning"
        >
          Sentence Case
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleInverseClick}
          disabled={operativeText.length === 0}
          outline
          rounded
          color="info"
        >
          Inverse Case
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleClearClick}
          disabled={operativeText.length === 0}
          outline
          rounded
          color={props.revMode}
        >
          Clear
        </MDBBtn>
        <MDBBtn
          size="sm"
          onClick={handleReadClick}
          disabled={operativeText.length === 0}
          outline
          rounded
        >
          <i className="fa-solid fa-bullhorn"></i>
        </MDBBtn>
        </div>

        <div className="my-2">
          <p>
            {wordCount} words, {operativeText ? operativeText.length : 0}{" "}
            characters
          </p>
          <p>
            {Math.floor(
              (operativeText ? operativeText.split(" ").length : 0) * 0.008
            )}{" "}
            Minutes
          </p>
          {preview}
        </div>
      </main>
      <aside
        style={{ flex: "1 2 300px", "--bs-bg-opacity": "0.4" }}
        className="bg-light p-3 rounded-4"
      >
        <ul
          className="nav nav-pills mb-3 nav-justified"
          id="pills-tab"
          role="tablist"

        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Summary
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Keyword Density
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex="0"
          >
            <li
              style={{ listStyleType: "none", cursor: "pointer" }}
              className="border-bottom border-1 py-1"
            >
              <span
                className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                style={{ marginTop: "2px" }}
              >
                {wordCount}
              </span>
              Words
            </li>
            <li
              style={{ listStyleType: "none", cursor: "pointer" }}
              className="border-bottom border-1 py-1"
            >
              <span
                className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                style={{ marginTop: "2px" }}
              >
                {operativeText ? operativeText.length : 0}
              </span>
              Characters
            </li>
            <li
              style={{ listStyleType: "none", cursor: "pointer" }}
              className="border-bottom border-1 py-1"
            >
              <span
                className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                style={{ marginTop: "2px" }}
              >
                {operativeText
                  ? operativeText
                      .split(".")
                      .filter((sentence) => sentence.trim().length).length
                  : 0}
              </span>
              Sentences
            </li>
            <li
              style={{ listStyleType: "none", cursor: "pointer" }}
              className="border-bottom border-1 py-1"
            >
              <span
                className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                style={{ marginTop: "2px" }}
              >
                {operativeText
                  ? operativeText
                      .split("\n\n")
                      .filter((sentence) => sentence.trim().length).length
                  : 0}
              </span>
              Paragraphs
            </li>
            <li
              style={{ listStyleType: "none", cursor: "pointer" }}
              className="border-bottom border-1 py-1"
            >
              <span
                className="badge bg-secondary px-2 py-1 rounded-pill float-end"
                style={{ marginTop: "2px" }}
              >
                {Math.floor(
                  (operativeText ? operativeText.split(" ").length : 0) * 0.25
                )}{" "}
                sec
              </span>
              Reading Time
            </li>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
            tabIndex="0"
          >
            {wordCount !== 0 && (
              <Keywords
                inputText={operativeText}
                highlightKeyWord={highlightKeyWord}
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
