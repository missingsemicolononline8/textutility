const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const fs = require( 'fs' );
const path = require("path");
const {StaticRouter} = require("react-router-dom/server");
const App = require("../src/App").default;

const app = express();
const PORT = process.env.PORT || 3001;

app.get(
  /\.(js|css|map|ico)$/,
  express.static(path.resolve(__dirname, "../prod/build"))
);

app.use("*", (req, res) => {
  let indexHTML = fs.readFileSync(
    path.resolve(__dirname, "../prod/build/index.html"),
    {
      encoding: "utf8",
    }
  );

  let appHTML = ReactDOMServer.renderToString(
    <StaticRouter location={req.originalUrl}>
      <App />
    </StaticRouter>
  );



   // populate `#app` element with `appHTML`
  indexHTML = indexHTML.replace( '<div id="root"></div>', `<div id="root">${appHTML}</div>` );
  
  res.contentType( 'text/html' );
  res.status( 200 );

  return res.send( indexHTML );
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
