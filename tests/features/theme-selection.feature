Feature: Theme Selection
  As an application user
  I want to choose the color theme of the interface
  So I can have a look that suits me

  Background:
    Given "Alex" visits the home screen

  Scenario: The default theme is applied on first visit
    Then "Alex" sees the "blue" theme active

  Scenario: Selecting a theme changes the interface accent
    When "Alex" selects the theme "green"
    Then "Alex" sees the "green" theme active

  Scenario: The selected theme is kept after a reload
    Given "Alex" has selected the theme "orange"
    When "Alex" reloads the page
    Then "Alex" sees the "orange" theme active
