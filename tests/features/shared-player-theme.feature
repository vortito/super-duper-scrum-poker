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

  Scenario: Players with different accents see each other's avatars in their own accent
    When "Alice" selects the theme "pink"
    When "Bob" selects the theme "orange"
    Then Alice sees Bob avatar in the "orange" accent
    Then Bob sees Alice avatar in the "pink" accent

  Scenario: Each player's card back is shown in the accent of its owner
    Given "Alice" has selected the theme "pink"
    Given "Bob" has selected the theme "orange"
    Given "Alice" has voted with the card "5"
    Given "Bob" has voted with the card "8"
    Then the card of "Alice" is shown in the "pink" accent
    Then the card of "Bob" is shown in the "orange" accent

  Scenario: Each revealed card number is shown in the deep accent of its owner
    Given "Alice" has selected the theme "pink"
    Given "Bob" has selected the theme "orange"
    Given "Alice" has voted with the card "5"
    Given "Bob" has voted with the card "8"
    When "Alice" reveals the cards
    Then the revealed card of "Alice" shows "5" in the "pink" accent
    Then the revealed card of "Bob" shows "8" in the "orange" accent
