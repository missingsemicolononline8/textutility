# Getting Started with Text Utils

Install the required packages using 

`npm install` 

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `prod/build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## Server Side Rendering

Server side rendering has been already implemented for Textutils. To utilize server side rendering first open `src/index.js` file then replace line "root.render(<BrowserRouter><App/></BrowserRouter>);" with "hydrateRoot(container,<BrowserRouter><App/></BrowserRouter>)". 

After that run `build:server` &  `start:server`