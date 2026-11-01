Feature: Voting with Estimation Cards
  As a team member
  I want to select and change my estimation card
  So I can express my effort assessment while the team votes in secret

  Scenario: Votes are synchronized between players
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    When "Bob" votes with the card "8"
    Then the vote counter shows "2 / 2" for "Alice" and "Bob"

  Scenario: A player can change their vote before the reveal
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "3"
    When "Alice" changes their vote to the card "8"
    Then the selected card of "Alice" is "8"

  Scenario: Board card is oriented facing the table center
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    Then the board card of "Alice" faces the table center

  Scenario: Concurrent votes are both kept in the average
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    Given "Bob" has voted with the card "8"
    When "Alice" reveals the cards
    Then the board shows "Alice" voting "5" and "Bob" voting "8"
    Then the average displayed is "6.5"

  Scenario: Changing my vote does not assign a vote to a player who has not voted
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    When "Alice" changes their vote to the card "8"
    Then the vote counter shows "1 / 2" for "Alice" and "Bob"
    Then the board card of "Bob" is hidden on the table
