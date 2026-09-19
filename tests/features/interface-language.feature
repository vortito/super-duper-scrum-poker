Feature: Interface Language
  As an application user
  I want to change the interface language
  So I can use the tool in my preferred language

  Background:
    Given "Alex" visits the home screen

  Scenario: The interface language can be switched
    When "Alex" selects the language "<code>"
    Then "Alex" sees the home screen displayed in "<language>"

    Examples:
      | code | language  |
      | en   | English   |
      | fr   | French    |
      | es   | Spanish   |
