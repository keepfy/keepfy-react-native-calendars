# Keepfy react native calendars

Keepfy calendar/agenda implementation inspired by wix [react-native-calendars](https://github.com/wix/react-native-calendars)

## Description

This package implements a similar solution like `react-native-calendars`, but using
typescript and react-hooks.


### Why

`react-native-calendars` seems to be abandoned, and their source code has to
support old features, and on top of that, they use the `XDate` package, which 
makes the code a little bit harder to type and deal with.

## TODO

 - [x] Calendar list
 - [x] Current day marking
 - [x] Day selection
 - [ ] Markings on days
 - [ ] Arrows on week day names
 - [ ] Documentation
 - [ ] Support i18n
 - [ ] Example app and gifs
 - [ ] Render and e2e tests
 - [ ] Support lazy loading a infinite stream of dates 
 (this one is kinda really hard.. RN lists need a size to be informed, but a date list
 has no start and end)

## Current state

The package is a WIP, but here's our current keepfy agenda using this package:
![Agenda](./records/agenda.gif)

## Notes

* We still recommend `react-native-calendars` instead of this package because
it has more features and options than this package
* RN < 60 compatibility is not a goal
* The `MonthList` component is not a calendar, since the calendar definition
is a 12 months list, `MonthList` can have more than 12 months.
* This package focus is on `MonthList`, not on `Agenda`
    * If you look at the agenda implementation, you will see that it's just a fancy section list
    with animations for `MontList`
* For now we will be depending on packages like `react-native-paper` and `react-native-typography`
that we use on our app, in the near future we hope to remove these dependencies.
