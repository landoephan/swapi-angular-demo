/// <reference path="../../support/index.d.ts" />
import {Then, When} from "cypress-cucumber-preprocessor/steps";

When('I visit {word}', (path: string) => {
  cy.visit(path);
});

Then('the path is {word}', (path: string) => {
  cy.url().should('eq', `${Cypress.config().baseUrl}${path}`);
});
