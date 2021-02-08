<img src="static/logo.png" width="48"/> Marvin
===
This is a keystroke launcher for Linux. It is build using electron but it has not been ported to Windows or MacOs yet.

## Installation
### Using a release AppImage
Download the `Marvin-*.AppImage` file for the newest release here: https://github.com/rolandbernard/marvin/releases
and copy it to a directory in your `PATH` variable (e.g. using `$ sudo cp Marvin-*.AppImage /usr/bin/marvin`).

### From source
To install from source, you can execute the following commands.
```
$ cd /tmp
$ git clone https://github.com/rolandbernard/marvin
$ cd marvin
$ yarn install
$ yarn dist
$ sudo cp ./dist/Marvin-*.AppImage /usr/bin/marvin
```

## Features
With the global shortcut (Super+D by default, but can be changed) you can open the main program.

### Settings
The settings can be opened by searching for 'Settings' (or 'Einstellungen'/'Impostazioni') in
the main window. The settings include general settings, theme settings and settings specific
to certain modules.

![screenshot](assets/settings.png)

### Themes
There are currently no predefined themes, but it is possible to configure most of the colors and
some other parameters in the settings under the 'Theme' tab.

![screenshots](assets/theme.png)

### Modules
The program uses different modules to provide different functionalities.

#### Linux system
This module will give you access to some fundamental linux system operations. (Reboot, Shutdown)

![screenshot](assets/linux_system.png)

#### Folders
This module allows you to browse files.

![screenshot](assets/folders.png)

#### HTML
This module allows you to create custom HTML entries.

![screenshot](assets/html.png)

#### Calculator
This module allows you to do calculations using Math.js or Algebrite.

![screenshot](assets/calculator.png)

#### Linux applications
This module allows you to start applications on linux.

![screenshot](assets/linux_application.png)

#### URL module
This module allows you to open urls.

![screenshot](assets/url.png)

#### Locate
This module allows you to search for files using locate.

![screenshot](assets/locate.png)

#### Shortcuts
This module allows you to define shortcuts to run shell scripts.

#### Command
This module allows you to execute shell commands.

![screenshot](assets/command.png)

#### Scripts
This module allows you to create custom entries to execute shell scripts.

#### Clipboard
This module allows you to access your clipboard history.

![screenshot](assets/clipboard.png)

#### Deepl
This module allows you to translate text by using Deepl in a headless window.

![screenshot](assets/deepl.png)

#### Linux windows
This module allows you to find open windows.

![screenshot](assets/linux_windows.png)

#### Google Translate
This module allows you to translate text by using Google Translate in a headless window.

![screenshot](assets/google_translate.png)

#### DuckDuckGo Instant Answer
This module gives you the DuckDuckGo Instant Answers for your query.

![screenshot](assets/duckduckgo.png)

#### History
This module allows you to execute recent options again.

![screenshot](assets/history.png)

#### Color
This module allows you to convert colors between hex/rgb/hsl.

![screenshot](assets/color.png)

#### Web search
This module allows you to quicky do a web search. It will open a URL, by inserting the query at a specific location.

![screenshot](assets/web_search.png)

#### Alias
This module allows you to add an alias for a certail option, that allows you to search it under a different name.

![screenshot](assets/alias.png)

#### Currency converter
This module allows you to quickly convert between currencies.

![screenshot](assets/currency_converter.png)

#### Dictionary
This module allows you to quickly lookup definitions and synonyms for words.

![screenshot](assets/dictionary.png)

#### Bookmarks
This module allows you to search through your Firefox, Midori and Chromium/Google Chrome bookmarks.

![screenshot](assets/bookmarks.png)

#### Email
This module allows one to quickly start writing a new email.

![screenshot](assets/email.png)

