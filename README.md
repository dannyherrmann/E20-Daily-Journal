# E20-Daily-Journal

## Overview

##### Step #1: Before serving this repo please create a journalEntires.json file in any directory of your choice and input below starter json data. The website needs to reference a pre-determiend set of "moods" in order for it to function properly. 

```
{

  "moods": [
    {
      "id": 1,
      "name": "Happy"
    },
    {
      "id": 2,
      "name": "Fine"
    },
    {
      "id": 3,
      "name": "Sad"
    }
  ],

  "entries": []

}
```

##### Step #2: Once you have your basic journalEntires.json file created - serve the .json file to port #8088 using json-server on your local machine. See below example terminal command where "journalEntries.json" is the name of the entries json file you created in step #1 above.
```
json-server journalEntries.json -p 8088 -w
```

##### Step #3: Clone this repo by pasting below command into your terminal: 
```
git clone git@github.com:dannyherrmann/E20-Daily-Journal.git
```
##### Step #4: cd into the cloned repo and serve it to any local port that is not port 8088 using "serve" command. 

##### Step #5: Route to your localhost in any web browser like http://localhost:3000 and you should see below web page! You will have no pre-existing entries. Just click on the "new entry" button to start adding some journal entries.

![alt text](styles/E20-Daily-Journal.JPG)