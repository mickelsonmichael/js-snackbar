# js-snackbar

## What is a Snackbar?

According to [Material Design](https://material.io/design/components/snackbars.html) a Snackbar or Toast provides "brief messages about app processes at the bottom of the screen." 

Generally, they should not have an icon associated with it and should be only one line on most devices.

While this version of a Snackbar follows the Material Design semantics closely, it strays in several major ways. 
1. You can send multiple snackbars to a user at a time, as opposed to a single Snackbar at a time. 
2. The Snackbar appears in the bottom right corner, as opposed to the bottom left or bottom center.

## Basic Usage
Simply call `new Snackbar();` to create the a notification message with default options.

## Options
To customize a Snackbar, pass the function a JS object with any of the following properties. All properties are optional.

| Property | typeof | Default Value | Notes |
| -------- | ------ | ------------- | ----- |
|message|String|"Operation performed successfully."||
|dismissible|bool|_true_||
|timeout|number or bool|5000|Integer represents milliseconds. To specify no timeout, set the value to false|
|status|string|""|Possible statuses include "success", "green", "warning", "alert", "orange", "danger", "error", "red." All other values will default to the blue "info" status|
