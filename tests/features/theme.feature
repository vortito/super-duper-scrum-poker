Feature: Theme Selection
  As an application user
  I want to choose the color theme of the interface
  So I can have a look that suits me

  Scenario: The default theme is applied on first visit
    Given a user visits the home screen
    Then the active theme is "blue"
    And the accent color is the color of the "blue" theme

  Scenario: Selecting a theme changes the accent color
    Given a user visits the home screen
    When they select the theme "green"
    Then the active theme is "green"
    And the accent color is the color of the "green" theme

  Scenario: The selected theme is kept after a reload
    Given a user visits the home screen
    When they select the theme "orange"
    And the page is reloaded
    Then the active theme is "orange"
    And the accent color is the color of the "orange" theme
