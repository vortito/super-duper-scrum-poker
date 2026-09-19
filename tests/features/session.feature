Feature: Room Creation and Participation
  As a facilitator or agile team participant
  I want to create rooms and join existing sessions
  So I can estimate user stories together as a team

  Scenario: Creating a new estimation room
    Given "Alice" visits the home screen
    When "Alice" creates a room
    Then "Alice" sees the room identifier on the board
    Then "Alice" appears in the participant list

  Scenario: The invitation link pre-fills the room code in the join form
    Given "Alice" has created an estimation room
    When "Bob" opens the invitation link for that room
    Then "Bob" sees the room code pre-filled in the join form

  Scenario: Joining a room via the invitation link
    Given "Alice" has created an estimation room
    When "Bob" joins the room via the invitation link with the name "Bob"
    Then "Alice" and "Bob" can see each other in the room

  Scenario: The start session button is disabled until a name is entered
    Given "Alice" visits the home screen
    Then "Alice" sees the start session button disabled

  Scenario: Opening the invitation link of a room that does not exist
    Given "Alice" visits the home screen
    When "Alice" opens the invitation link for the room "ZZZZZZ"
    Then "Alice" sees the room code "ZZZZZZ" pre-filled in the join form
    Then "Alice" sees an error that the room does not exist

  Scenario: Copying the room link copies the current room URL
    Given "Alice" has created an estimation room
    When "Alice" clicks the copy link button
    Then "Alice" clipboard contains the current room URL
