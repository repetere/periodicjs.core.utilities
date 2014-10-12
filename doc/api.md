<a name="Utilities"></a>
#class: Utilities
**Members**

* [class: Utilities](#Utilities)
  * [new Utilities()](#new_Utilities)
  * [utilities.isValidObjectID(str)](#Utilities#isValidObjectID)
  * [utilities.run_cmd(cmd, args, callBack)](#Utilities#run_cmd)
  * [utilities.async_run_cmd(cmd, args, asynccallback, callBack)](#Utilities#async_run_cmd)
  * [utilities.restart_app(options)](#Utilities#restart_app)
  * [utilities.sortObject(dir, field)](#Utilities#sortObject)
  * [utilities.removeEmptyObjectValues(obj)](#Utilities#removeEmptyObjectValues)
  * [utilities.replaceBooleanStringObjectValues(obj)](#Utilities#replaceBooleanStringObjectValues)
  * [utilities.removePrivateInfo(obj)](#Utilities#removePrivateInfo)
  * [utilities.stripTags(textinput)](#Utilities#stripTags)
  * [utilities.makeNiceName(username)](#Utilities#makeNiceName)
  * [utilities.makeNiceAttribute(username)](#Utilities#makeNiceAttribute)
  * [utilities.getAdminMenu(options)](#Utilities#getAdminMenu)

<a name="new_Utilities"></a>
##new Utilities()
A group of utility functions for restarting periodic's express application and helper functions to manipulate strings and other data structures.

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="Utilities#isValidObjectID"></a>
##utilities.isValidObjectID(str)
simple helper function for validating mongo object IDs

**Params**

- str `string` - mongo object id  

**Returns**: `Boolean` - [description]  
<a name="Utilities#run_cmd"></a>
##utilities.run_cmd(cmd, args, callBack)
shorthand method for running shell commands

**Params**

- cmd `string` - shell command  
- args `array` - command line arguments  
- callBack `function` - async callback  

**Returns**: `function` - callback(response)  
<a name="Utilities#async_run_cmd"></a>
##utilities.async_run_cmd(cmd, args, asynccallback, callBack)
shorthand method for running shell commands

**Params**

- cmd `string` - shell command  
- args `array` - command line arguments  
- asynccallback `function` - async callback  
- callBack `function` - callback  

**Returns**: `function` - callback(response)  
<a name="Utilities#restart_app"></a>
##utilities.restart_app(options)
shorthand method for restarting periodic by updating the node script's watch file content/extensions/restart.json

**Params**

- options `object` - restartfile - define a custom restart file  

<a name="Utilities#sortObject"></a>
##utilities.sortObject(dir, field)
custom object sort by field

**Params**

- dir `string` - either asc or desc  
- field `string` - object property to seach  

**Returns**: `function` - object sort compare function  
**Example**  
req.controllerData.searchdocuments = searchdocuments.sort(CoreUtilities.sortObject('desc', 'createdat'));

<a name="Utilities#removeEmptyObjectValues"></a>
##utilities.removeEmptyObjectValues(obj)
remove empty object properties that have empty values

**Params**

- obj `object` - object to remove empty fields from  

**Returns**: `object` - object with empty values removed  
<a name="Utilities#replaceBooleanStringObjectValues"></a>
##utilities.replaceBooleanStringObjectValues(obj)
replace boolean strings with actual boolean values

**Params**

- obj `object` - object to substitute values  

**Returns**: `object` - object with boolean values  
**Example**  
updatedThemeSettings = CoreUtilities.replaceBooleanStringObjectValues(updatedThemeSettings);

<a name="Utilities#removePrivateInfo"></a>
##utilities.removePrivateInfo(obj)
remove private data from user objects

**Params**

- obj `object` - user object  

**Returns**: `object` - object with removed private data  
<a name="Utilities#stripTags"></a>
##utilities.stripTags(textinput)
replace all non alpha numeric tags with dashes and lowercase

**Params**

- textinput `string` - string to manipulate  

**Returns**: `string` - manipulated string  
<a name="Utilities#makeNiceName"></a>
##utilities.makeNiceName(username)
replace all non alpha numeric tags with dashes and lowercase

**Params**

- username `string` - string to manipulate  

**Returns**: `string` - manipulated string  
<a name="Utilities#makeNiceAttribute"></a>
##utilities.makeNiceAttribute(username)
replace all non alpha numeric tags with dashes and lowercase

**Params**

- username `string` - string to manipulate  

**Returns**: `string` - manipulated string  
<a name="Utilities#getAdminMenu"></a>
##utilities.getAdminMenu(options)
add additional admin interface items from periodic extensions

**Params**

- options `object` - config options  

**Returns**: `object` - admin menu json object  
