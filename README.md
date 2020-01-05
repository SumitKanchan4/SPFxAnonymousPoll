# SPFx Simple Anonymous Poll

[![SharePointWidgets.com](/Images/sharePointWidgetsBanner.png?raw=true)](https://www.sharepointwidgets.com)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/SumitKanchan4/SPFxAnonymousPoll)

This is a Microsoft SharePoint Framework or SPFx simple anonymous poll control, with simple configuration

# Features!

  - Simple configuration for the webpart to use
  - Safe and fast as there is no external saving of data
  - Option to show/hide results from user
  - In case of hiding, results will be shown only to page editors in edit mode
  - Start/Stop the poll 
  - Single user - single vote
 
### Configuration

![SPFx Tab Control Edit Mode](/Images/SPFxTab-EditMode.png?raw=true)

### View Mode

##### Poll View
![SPFx Tab Control](/Images/SPFxTab-ViewMode.png?raw=true)

##### Result view to users
![SPFx Tab Control](/Images/SPFxTab-ViewMode.png?raw=true)

##### After vote view when result is hidden
![SPFx Tab Control](/Images/SPFxTab-ViewMode.png?raw=true)
### Installation

Clone the repository and perform the commands as mentioned below.

```sh
$ npm install
$ gulp clean
$ gulp bundle --ship
$ gulp package-solution --ship
```

### Todos

 - Refresh of property pane radio buttons when cancelling the event

License
----

MIT
