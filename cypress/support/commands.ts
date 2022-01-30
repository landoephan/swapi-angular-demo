// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Chainable = Cypress.Chainable

Cypress.Commands.add('getBySel', (selector, ...args): Chainable => cy.get(`[data-cy=${selector}]`, ...args))

Cypress.Commands.add('getBySelLike', (selector, ...args): Chainable => cy.get(`[data-cy*=${selector}]`, ...args))

// run once before all tests
// set some global catch all interceptors
before(() => {
	// intercept all not explicit configured api calls
	cy.intercept(/api.*/, {
		statusCode: 501,
	}).as('apiCatchAll')
})

// run before every test
beforeEach(() => {})
