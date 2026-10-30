Feature: Shared Player Theme
  As a player in an estimation session
  I want my chosen theme to be visible on my avatar
  So that my teammates can recognise me by colour

  Background:
    Given an active room with "Alice" and "Bob"

  Scenario: A player's avatar shows the accent of the theme they select
    When "Alice" selects the theme "green"
    Then Bob sees Alice avatar in the "green" accent

  Scenario: The theme change on the table is shared in real time
    When "Alice" switches to the "light" mode
    When "Alice" selects the theme "pink"
    Then Bob sees Alice avatar in the "pink" accent

  Scenario: The shared theme is kept after a reload of the observer
    Given "Alice" has selected the theme "cyan"
    When "Bob" reloads the page
    Then Bob sees Alice avatar in the "cyan" accent
