Feature: Card Reveal and Results
  As a development team
  I want to see the revealed votes and the resulting average or consensus
  So I can agree on an estimate and move to the next round

  Scenario: The average is shown when the estimates differ
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    Given "Bob" has voted with the card "8"
    When "Alice" reveals the cards
    Then the board shows "Alice" voting "5" and "Bob" voting "8"
    Then the average displayed is "6.5"

  Scenario: A unanimous consensus is detected automatically
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    Given "Bob" has voted with the card "5"
    When "Alice" reveals the cards
    Then the consensus is shown with the agreed value "5"

  Scenario: Starting a new round resets the votes
    Given an active room with "Alice" and "Bob"
    Given "Alice" has voted with the card "5"
    Given "Bob" has voted with the card "8"
    Given "Alice" has revealed the cards
    When "Alice" starts a new round
    Then the vote counter shows "0 / 2" for "Alice" and "Bob"
    Then the cards of "Alice" and "Bob" are hidden on the table
