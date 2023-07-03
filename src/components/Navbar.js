import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  function handleColorChange(input) {
    document.querySelector("#color_front").style.backgroundColor =
      input.target.value;
    props.setNightTheme(input.target.value);
  }
  return (
    <nav className={`navbar navbar-expand-lg bg-${props.mode}`}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {props.title}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                {props.aboutText}
              </Link>
            </li>
          </ul>
          <div className="mx-3">
            <span
              className="border border-light rounded-circle"
              style={{
                width: "25px",
                height: "25px",
                backgroundColor: "#02243E",
                display: "inline-block",
                "--bs-border-width": "3px",
              }}
              id="color_front"
              onClick={() => {
                document.querySelector("#color").click();
              }}
              role="button"
            ></span>
            <input
              type="color"
              className="invisible"
              style={{ width: 0 }}
              name=""
              id="color"
              onChange={handleColorChange}
            />
          </div>
          <div className="form-check form-switch">
            <input
              style={{ cursor: "pointer" }}
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={props.toggleMode}
              checked={props.mode === "dark"}
            />
            <label className={`form-check-label text-${props.revMode}`}>
              Dark Mode
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  aboutText: PropTypes.string,
};

/* Navbar.defaultProps = {
    title: "Insert Title",
    aboutText: "Insert About Text",
} */
