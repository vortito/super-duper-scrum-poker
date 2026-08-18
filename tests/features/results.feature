Feature: Card Reveal and Results
  As a development team
  I want to see revealed votes, the average or unanimous consensus
  And be able to start new estimation rounds

  Scenario: Reveal cards and calculate the average of different estimates
    Given an active room with "Alice" and "Bob"
    And "Alice" votes card "5"
    And "Bob" votes card "8"
    When "Alice" clicks on "Revelar Cartas"
    Then the cards are revealed showing "5" and "8" on the board
    And the average displayed on screen is "6.5"

  Scenario: Automatic detection of unanimous consensus
    Given an active room with "Alice" and "Bob"
    And "Alice" votes card "5"
    And "Bob" votes card "5"
    When "Alice" clicks on "Revelar Cartas"
    Then the consensus message "¡Trato hecho!" is shown with the agreed value "5"

  Scenario: Reset the room for a new round
    Given a room with revealed votes between "Alice" and "Bob"
    When "Alice" clicks on "Nueva Ronda"
    Then the board cards are hidden and votes reset to "0 / 2 votos"
