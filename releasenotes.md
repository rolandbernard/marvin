
# Release notes

v0.2.0

* Added Windows support
   * All modules except for the locate module have been ported
   * There is an installer and a portable version
   * The Windows version has an autostart option
* Improved the history module
   * Results that can no longer be executed will be hidden
   * The results now update to match the new settings for some modules
* Fixed the loading animation with incremental results


v0.1.0

* Improved multiple modules
   * Added more configuration to the alias module
   * Browser location is now a configuration for the bookmarks module
   * Added hsv to the color module
   * Fixed the currency converter
   * Replaced the deepl module with the translate module
* More modules are now enabled by default
* Improved themes
   * Changed the default theme
   * Added more settings
   * Added theme colors for settings
   * Added predefined themes
* Improved autocomplete
   * More modules have autocomplete value
   * Autocomplete values are shown in input when possible
* Improved settings
   * Complete redesign
   * Better input components for time, size, etc.
   * Improved reliability

Internal (No difference to the user):

* Complete rewrite in TypeScript
* Improved architecture
* Made the application easier to port


v0.0.27

* Bug fixes
* Minor changes


v0.0.26

* Fixed image and video preview size
* Improved output of the folder module
* Improved the settings

Internal (No difference to the user):

* Cleaned up internals significantly
* Fixed builds on node 16


v0.0.25

* Improved the output of the dictionary module
* Fixed some infinite loading errors
* Improved result output
  * Now using a configurable debounce delay to avoid flicker
  * Debounce is now done entirely in the renderer

Internal (No difference to the user):

* Cleaned up the executor
* Reverted dependency update, because it broke `yarn dev`


v0.0.24

* Fixed scrolling while 'hovering' with the mouse
* Added an option to weigh history module search results by frequency
* Fixed some spelling mistakes

Internal (No difference to the user):

* Cleaned up the executor slightly
* Removed unused dependencies
* Updated all dependencies


v0.0.23

* Added mouse support
   * The mouse can be used to select and execute results
   * The mouse can be used to drag and drop files from the search results
* Fixed deleting items from array settings
* Fixed opening of files containing spaces in the path
* Slight performance improvement
* Brought back the scrollbar
   * Scrollbar is now coloured using the output accent colour
   * Also changed the scrollbar appearance in the settings


v0.0.22

* Significantly improved performance
* Fixed the quality calculation in the Linux application module


v0.0.21

* Fixed significant problems in the Linux applications module
   * Fixed the .desktop file parsing (It no longer fails if the value contains a `=`)
   * Improved the icon file search (This fixes issues with some programs)
* Improved the option search weights
* Upgraded dependencies


v0.0.20

* Added an option to quit the application
* Added a tray icon
   * Allows opening the main window without the shortcut
   * Allows opening the settings window directly
   * Allows quitting the application
* Improved search ordering for the Linux applications module
* No longer quitting when the global shortcut cannot be registered (You can still access the tray icon)

Internal (No difference to the user):

* Added the main module which now handles the main window, tray icon and global shortcut
* Moved everything concerning the settings window (creation/destruction) into the settings module


v0.0.19

* Removed the Google Translate module, because it no longer works
* Added a confirmation window before deleting the history or resetting the config
* Added a setting to disable sorting the history by frequency


v0.0.18

* Added an option to only match the longest possible prefix
* Added the possibility to disable enhanced search
* Added four buttons to the settings
   * Added a button to reset all settings to the default
   * Added a button to immediately refresh the application list
   * Added a button to clear the clipboard history
   * Added a button to clear the execution history
* Improved the Locate module
* Slightly improved the searching
* Slightly adjusted the default settings
* Fixed the code setting input
* Fixed a bug where settings don't update
* Fixed a bug where the Command module removes the prefix twice


v0.0.17

* Added Algebrite as a backend option for the calculator module
* The history module now sorts by frequency and not by most recent
* Added more theme options
* Improved the search
   * Searching now searches over all language options
   * The text matching function is now more lenient
* Slight update to the readme


v0.0.16

* Fixed some translation mistakes
* Improved the browser bookmarks module
   * Firefox bookmarks no longer use the sqlite3 database (This resolves the long loading)
   * Firefox bookmarks now include the websites icon
   * Midori and Firefox bookmarks now update immediately, like those of Chrome/Chromium
* Fixed some problems with the dependencies


v0.0.15

* Added the Currency converter module
* Added the Dictionary module
* Added the Bookmarks module
* Added the Email module


v0.0.14

* Added alpha values to the Color module
* Added the Web Search module
* Added the Alias module
* Fixed multiple bugs

Internal (No difference to the user):

* Added a general select setting type (instead of a special language setting)
* Added the option setting type
* Changed the names of some IPC messages


v0.0.13

* Better filtering for the calculator module
* Removed unsupported files from the file previews
* Made the history module searchable (changeable using a setting)
* Reduced the maximum output text that is transferred to the rendering process (to avoid performance problems)
* Fixed the version display in the settings, and the field in the config (by always overriding the field)
* Increased the maximum transfer limit
* Fixed centering of large text output


v0.0.12

* Added more theme settings
* Upgraded to Electron 11 (Electron still seams very broken)


v0.0.11

* Added the version number to the settings window
* Added a cache to the Linux application module to improve startup time
* Added shortcut validation in the settings
* Added the color module
* Added previews for files, URLs, and colours
* Improved the code settings input area
* Fixed DuckDuckGo module images
* Fixed the execution of multiline scripts and shortcuts
* Upgraded the electron version
* Fixed the previews


v0.0.10

* Improved the DuckDuckGo Instant Answer module
* Added an option to center the window when reopening it


v0.0.9

* Fixed the English target for the deepl module.
* All modules can now use a prefix


v0.0.1 - v0.0.8

Initial releases

