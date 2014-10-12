# periodicjs.core.utilities

Periodic's Core Utilities module contains a group of utility functions for restarting periodic's express application and helper functions to manipulate strings and other data structures

 [API Documentation](https://github.com/typesettin/periodicjs.core.utilities/blob/master/doc/api.md)

## Installation

```
$ npm install periodicjs.core.utilities
```

This is a part of Periodic's core.

## Usage

### Querying for tag
*JavaScript*
```javascript
var Utilities = require('periodicjs.core.utilities'),
	CoreUtilities = new Utilities(resources),
	Tag = mongoose.model('Tag');
req.controllerData = (req.controllerData) ? req.controllerData : {};

var createTag = function (req, res) {
	var newtag = CoreUtilities.removeEmptyObjectValues(req.body);
		newtag.name = CoreUtilities.makeNiceName(newtag.title);
		newtag.author = req.user._id;

	CoreController.createModel({
		model: Tag,
		newdoc: newtag,
		res: res,
		req: req,
		successredirect: '/p-admin/tag/edit/',
		appendid: true
	});
};
```

##Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli
```

Then run grunt watch
```
$ grunt watch
```

##Notes
* Check out https://github.com/typesettin/periodicjs for the full Periodic Documentation