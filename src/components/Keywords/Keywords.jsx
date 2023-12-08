import React, { useEffect, useState, useCallback } from "react";
import Loader from "../Loader/Loader";
import "./Keywords.css";
import Keyword from "./Keyword";

function Keywords({ inputText, highlightKeyWord }) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounce = useCallback((func, delay) => {
    return function (...args) {
      return setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  useEffect(() => {
    const fetchKeywords = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append(
          "api_key",
          process.env.REACT_APP_PARALLELDOTSAPI
        );
        formData.append("text", inputText);
        const options = {
          method: "POST",
          body: formData,
        };
        const response = await fetch(
          "https://apis.paralleldots.com/v4/keywords",
          options
        );
        const parsedResponse = await response.json();
        setKeywords(parsedResponse?.keywords ?? []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching keywords:", error);
        setLoading(false);
      }
    };

    if (inputText.length === 0) {
      setKeywords([]);
      return;
    }

    const delayedFetchKeywords = debounce(fetchKeywords, 2000);
    let tOutID = delayedFetchKeywords();

    return () => {
      clearTimeout(tOutID);
    };
  }, [inputText, debounce]);

  function calculateKeywordDensity(keyword, text) {
    // Tokenize the text into words
    const tokens = text.toLowerCase().match(/\b\w+\b/g);

    // Calculate total words
    const totalWords = tokens.length;

    // Count keywords of different lengths
    const keywordTokens = keyword.toLowerCase().split(/[\s-]+/); // Split by space or hyphen
    const keywordLength = keywordTokens.length;

    let count = 0;
    for (let i = 0; i < tokens.length - keywordLength + 1; i++) {
      if (
        tokens.slice(i, i + keywordLength).join(" ") === keywordTokens.join(" ")
      ) {
        count++;
      }
    }

    // Calculate density for the keyword
    const keywordDensity = (count / totalWords) * 100; // Density per 100 words

    return { count: count, density: keywordDensity.toFixed(1) };
  }

  const renderFilteredKeywords = (keywordLength, score) =>
    keywords
      .filter(
        kw =>
          kw.keyword.split(" ").length === keywordLength &&
          kw.confidence_score > score
      )
      .map((kw) => {
        let currKeyword = {
          keyword: kw.keyword,
          ...calculateKeywordDensity(kw.keyword, inputText),
        };
        return (
          <Keyword
            highlightKeyWord={() => highlightKeyWord(kw.keyword)}
            key={kw.keyword}
            keyword={currKeyword}
          />
        );
      });

  return (
    <>
      {loading && <Loader loaderText="Fetching Keywords" />}{" "}
      {inputText.length > 0 && keywords.length > 0 && !loading && (
        <div className="keywords">
          <div className="kw-head d-flex justify-content-between align-items-center">
            <h5 className="fw-normal fs-5" style={{ marginBottom: "0" }}>
              Keyword Density
            </h5>
            <ul
              className="nav nav-pills keyword-filter"
              id="kwLength-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link fs-6 active"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#one-word-keywords"
                  type="button"
                  role="tab"
                  aria-controls="one-word-keywords"
                  aria-selected="true"
                >
                  x1
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link fs-6"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#two-word-keywords"
                  type="button"
                  role="tab"
                  aria-controls="two-word-keywords"
                  aria-selected="false"
                >
                  x2
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link fs-6"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#three-word-keywords"
                  type="button"
                  role="tab"
                  aria-controls="three-word-keywords"
                  aria-selected="false"
                >
                  x3
                </button>
              </li>
            </ul>
          </div>

          <div className="kw-body mt-3">
            <div className="tab-content" id="kwLength-tabContent">
              <div
                className="tab-pane fade show active"
                id="one-word-keywords"
                role="tabpanel"
                aria-labelledby="one-word-keywords-tab"
              >
                {renderFilteredKeywords(1, 0.4)}
              </div>
              <div
                className="tab-pane fade"
                id="two-word-keywords"
                role="tabpanel"
                aria-labelledby="two-word-keywords-tab"
              >
                {renderFilteredKeywords(2, 0.4)}
              </div>
              <div
                className="tab-pane fade"
                id="three-word-keywords"
                role="tabpanel"
                aria-labelledby="three-word-keywords-tab"
              >
                {renderFilteredKeywords(3, 0.4)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Keywords;
