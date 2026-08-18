Feature: Room and Participant Management
  As a facilitator or agile team participant
  I want to create rooms and join existing sessions
  So I can estimate user stories as a team

  Scenario: Successfully create a new estimation room
    Given a user visits the home screen
    When they create a room with the name "Alice"
    Then they see the room board with a unique identifier
    And "Alice" appears in the participant list

  Scenario: Join an existing room via direct link
    Given "Alice" has created an estimation room
    When "Bob" accesses the room via the invitation link
    And confirms their entry with the name "Bob"
    Then "Bob" enters the room
    And "Alice" and "Bob" can see each other in the estimation room

  Scenario: Required field validation on the form
    Given a user visits the home screen
    Then the start session button is disabled when the name is empty
