<img src="static/logo.png" width="48"/> Marvin
===
This is a keystroke launcher for Linux. It is build using electron but it has not been ported to Windows or MacOs yet.

## Instalation
At this point the only way to install this application, is to install it from source.
To do that, you can execute the following commands.
```
$ cd /tmp
$ git clone https://github.com/rolandbernard/marvin
$ cd marvin
$ yarn dist
$ sudo cp ./dist/Marvin-*.AppImage /usr/bin/marvin
```

## Features
With the global shortcut (Super+D by default, but can be changed) you can open the main program.
The program uses different modules to provide different functionalities.

### Modules

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
This module allows you to do calculations using mathjs.

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


