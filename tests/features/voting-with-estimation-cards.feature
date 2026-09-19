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
