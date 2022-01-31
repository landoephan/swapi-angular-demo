/// <reference path="../../support/index.d.ts" />
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

Given('people request will succeed', () => {
	cy.intercept('GET', '/api/people?*', {
		statusCode: 200,
		fixture: 'people.get.json',
	}).as('people_success')
})

Given('people request will fail', () => {
	cy.intercept('GET', '/api/people?*', {
		statusCode: 500,
	}).as('people_failure')
})

Given('person request will succeed', () => {
	cy.intercept('GET', '/api/people/*/', {
		statusCode: 200,
		fixture: 'person.get.json',
	}).as('person_success')
})

Given('person request will fail', () => {
	cy.intercept('GET', '/api/people/*/', {
		statusCode: 500,
	}).as('person_failure')
})

Given('homeworld request will succeed', () => {
	cy.intercept('GET', '/api/planets/*/', {
		statusCode: 200,
		fixture: 'planet.get.json',
	}).as('planet_success')
})

Given('homeworld request will fail', () => {
	cy.intercept('GET', '/api/planets/*/', {
		statusCode: 500,
	}).as('planet_failure')
})

Given('film request will succeed', () => {
	cy.intercept('GET', '/api/films/*/', {
		statusCode: 200,
		fixture: 'film.get.json',
	}).as('film_success')
})

Given('film request will fail', () => {
	cy.intercept('GET', '/api/films/*/', {
		statusCode: 500,
	}).as('film_fail')
})

Given('people search request will succeed', () => {
	cy.intercept('GET', '/api/people/?search=*', {
		statusCode: 200,
		fixture: 'people.get.json',
	}).as('people_search_success')
})

Given('people search request will succeed without result', () => {
	cy.intercept('GET', '/api/people/?search=*', {
		statusCode: 200,
		fixture: 'people.empty.get.json',
	}).as('people_search_success_no_results')
})

Given('people search request will fail', () => {
	cy.intercept('GET', '/api/people/?search=*', {
		statusCode: 500,
	}).as('people_search_fail')
})

When('I visit {word}', (path: string) => {
	cy.visit(path)
})

When('I click on first person details', () => {
	cy.getBySel('person-detail-button-0').click()
})

When('I toggle random switch', () => {
	cy.getBySel('random-slider').click()
})

When('I search for people', () => {
	cy.getBySel('search-input').type('Test')
	cy.getBySel('search-button').click()
})

When('I empty search field', () => {
	cy.getBySel('search-input').clear().type('{enter}')
})

When('I type into search field', () => {
	cy.getBySel('search-input').type('Test')
})

Then('the path is {word}', (path: string) => {
	cy.url().should('eq', `${Cypress.config().baseUrl}${path}`)
})

Then('the toolbar is visible', () => {
	cy.getBySel('app-toolbar').should('be.visible')
})

Then('the headline is visible', () => {
	cy.getBySel('app-headline').contains('Star Wars people')
})

Then('{int} people are visible', (count: number) => {
	cy.getBySelLike('person-card').should((elem: any) => {
		expect(elem).to.have.length(count)
		expect(elem.first()).to.contain('Birth year')
		expect(elem.first()).to.contain('Gender')
		expect(elem.first()).to.contain('Height')
		expect(elem.first()).to.contain('Details')
	})
	cy.getBySel('person-details').should('not.exist')
})

Then('empty message is visible', () => {
	cy.getBySel('person-details').should('not.exist')
	cy.getBySel('empty-results-info').should('be.visible')
})

Then('the details for a person are visible', () => {
	cy.wait('@person_success').wait('@planet_success').wait('@film_success')
	cy.getBySel('person-details').should('be.visible').contains('Details for Luke Skywalker')
	cy.getBySel('person-homeworld').should('be.visible').contains('Homeworld: Haruun Kal')
})

Then('the homeworld is not visible', () => {
	cy.getBySel('person-homeworld').should('not.exist')
})

Then('the films are visible', () => {
	cy.getBySel('person-films').contains(
		'Films: Revenge of the Sith, Revenge of the Sith, Revenge of the Sith, Revenge of the Sith'
	)
})

Then('the first card is highlighted', () => {
	cy.getBySel('person-card-0').should('have.class', 'active-card')
	cy.getBySel('person-card-1').should('not.have.class', 'active-card')
	cy.getBySel('person-card-2').should('not.have.class', 'active-card')
})

Then('no card is highlighted', () => {
	cy.getBySelLike('person-card').should('not.have.class', 'active-card')
})

Then('no people are visible', () => {
	cy.getBySelLike('person-card').should('not.exist')
})

Then('no films are visible', () => {
	cy.getBySel('person-films').should('not.exist')
})

Then('no person details are visible', () => {
	cy.getBySel('person-details').should('not.exist')
})

Then('an error is shown with message {string}', (message: string) => {
	cy.contains(message).should('be.visible')
})

When('search field is empty', () => {
	cy.getBySel('search-input').should('be.empty')
})
