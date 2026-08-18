Feature: Voting with Fibonacci Cards
  As a team member
  I want to select and change my estimation card
  So I can express my effort assessment synchronously

  Scenario: Synchronized voting between multiple players
    Given an active room with "Alice" and "Bob"
    When "Alice" votes card "5"
    And "Bob" votes card "8"
    Then the vote indicator shows "2 / 2 votos" for both "Alice" and "Bob"

  Scenario: A player changes their vote before reveal
    Given an active room with "Alice" and "Bob"
    When "Alice" votes card "3"
    And "Alice" changes their vote to card "8"
    Then the card selected by "Alice" is "8"
