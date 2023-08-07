import React, { useState, useEffect } from "react";
import Keywords from "./Keywords/Keywords";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  CompositeDecorator,
} from "draft-js";
import * as draftOperations from "./helper";
import "draft-js/dist/Draft.css";
import "./Editor.css";

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
    draftOperations.updateEditorContent(
      textbox,
      selectionState,
      "",
      setTextbox,
      Modifier,
      EditorState
    );
  }

  function handleEditClick() {
    setTextbox(result);
  }

  function handleCopyClick() {
    navigator.clipboard.writeText(result);
    props.showAlert("Copied to Clipboard", "success");
  }

  function handleReadClick(e) {
    if (operativeText.length) {
      let speech = new SpeechSynthesisUtterance();
      speech.text = operativeText;
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
      <main style={{ flex: "1 0 600px" }}>
        <div>
          <h1 className="my-3 fs-4">{props.heading}</h1>
          <div className="mb-3 position-relative">
            <Editor
              editorState={textbox}
              onChange={onEditorChange}
              handleKeyCommand={handleKeyCommand}
              id="myBox"
            />
          </div>
          <button
            disabled={textbox.length === 0}
            className="btn btn-primary"
            onClick={handleUpClick}
          >
            Uppercase
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-warning ms-3"
            onClick={handleLowClick}
          >
            Lowercase
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-success ms-3"
            onClick={handleAlternateClick}
          >
            Alternate Case
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-light ms-3"
            onClick={handleTitleClick}
          >
            Title Case
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-dark ms-3"
            onClick={handleSentenceClick}
          >
            Sentence Case
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-info ms-3"
            onClick={handleInverseClick}
          >
            Inverse Case
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-danger ms-3"
            onClick={handleClearClick}
          >
            Clear
          </button>
          <button
            disabled={textbox.length === 0}
            className="btn btn-link ms-3"
            onClick={handleReadClick}
          >
            Read
          </button>
        </div>
        <div className="my-2">
          <h2>Your text summary</h2>
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
        style={{ flex: "1 0 150px", "--bs-bg-opacity": "0.4" }}
        className="bg-light p-3 rounded-4"
      >
        {wordCount !== 0 && (
          <Keywords
            inputText={operativeText}
            highlightKeyWord={highlightKeyWord}
          />
        )}
      </aside>
    </div>
  );
}
