Feature: App Page

  Scenario: Page layout is as expected
    When I visit /
    Then the path is /
    And the toolbar is visible
    And the headline is visible

  Scenario: People are shown on successful requests
    Given people request will succeed
    And person request will succeed
    And homeworld request will succeed
    And film request will succeed
    When I visit /
    Then 3 people are visible
    When I click on first person details
    Then the details for a person are visible
    And the first card is highlighted
    And the films are visible

  Scenario: Error is shown on failed people request
    Given people request will fail
    When I visit /
    Then no people are visible
    And an error is shown with message 'Error while loading the people. Please try again.'

  Scenario: Error is shown on failed person request
    Given people request will succeed
    And person request will fail
    When I visit /
    Then 3 people are visible
    When I click on first person details
    Then an error is shown with message 'Error while loading person details. Please try again.'

  Scenario: Error is shown on failed planet request
    Given people request will succeed
    And person request will succeed
    And homeworld request will fail
    And film request will succeed
    When I visit /
    Then 3 people are visible
    When I click on first person details
    Then an error is shown with message 'Error while loading the homeworld.'
    And the homeworld is not visible
    And the films are visible

  Scenario: Error is shown on failed film request
    Given people request will succeed
    And person request will succeed
    And homeworld request will succeed
    And film request will fail
    When I visit /
    Then 3 people are visible
    When I click on first person details
    Then an error is shown with message 'Error while loading films.'
    And no films are visible

  Scenario: Change people on random switch
    Given people request will succeed
    And person request will succeed
    When I visit /
    And I click on first person details
    Then the first card is highlighted
    When I type into search field
    And I toggle random switch
    Then no person details are visible
    And no card is highlighted
    And search field is empty

  Scenario: Search people
    Given people request will succeed
    And people search request will succeed
    And person request will succeed
    When I visit /
    Then 3 people are visible
    When I click on first person details
    And I search for people
    Then 5 people are visible
    And no person details are visible
    And no card is highlighted
    When I empty search field
    Then 3 people are visible

  Scenario: Search people without results
    Given people request will succeed
    Given people search request will succeed without result
    When I visit /
    Then 3 people are visible
    When I search for people
    Then no people are visible
    And empty message is visible

  Scenario: Search people request fails
    Given people request will succeed
    Given people search request will fail
    When I visit /
    Then 3 people are visible
    When I search for people
    Then no people are visible
    And an error is shown with message 'Error while searching people. Please try again.'
