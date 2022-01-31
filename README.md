# SwapiCodingChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.\
The app shows Star Wars people using the [Star Wars API](https://swapi.dev/). \
When entered, the page shows the first three people retrieved from the API. Toggle the 'Randomize people'-switch to reload people and get three random ones. \
You can also search for a person's name via the input field. Then you can get more than three results.

At the bottom of every person you can click on button 'Details' to see more information regarding that person.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running end-to-end tests

Run `npm run cypress:run` to execute headless end-to-end tests via cypress. To use this command, the development server needs to be running.\
Run `npm run cypress:open` to run cypress tests in a browser.

## Show code coverage
Run `npm run cypress:coverage` to get a summary on the code coverage. The code coverage computes the source code lines that were executed during the last test run.\
Run `npm run coverage:open` to open a more detailed report inside the browser.
