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

  Scenario: Switching to light mode changes the surface palette and keeps the accent
    Given "Alex" has selected the theme "green"
    When "Alex" switches to the "light" mode
    Then "Alex" sees the "light" mode active
    Then "Alex" sees the "green" accent active

  Scenario: Switching to dark mode restores the dark surface palette and keeps the accent
    Given "Alex" has selected the theme "orange"
    Given "Alex" has switched to the "light" mode
    When "Alex" switches to the "dark" mode
    Then "Alex" sees the "dark" mode active
    Then "Alex" sees the "orange" accent active

  Scenario: The mode and accent are kept after a reload
    Given "Alex" has selected the theme "cyan"
    Given "Alex" has switched to the "light" mode
    When "Alex" reloads the page
    Then "Alex" sees the "light" mode active
    Then "Alex" sees the "cyan" accent active

  Scenario: The default mode is dark with the blue accent on first visit
    Then "Alex" sees the "dark" mode active
    Then "Alex" sees the "blue" accent active
