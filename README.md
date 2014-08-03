connect-diskDB
==============

diskDB [https://github.com/arvindr21/diskDB] session store for Connect.

### Installation
```shell
$ npm install connect-diskdb
``` 

### Usage 
###### (in a typical express > v4.x app)
```javascript
	var app = require('express')(),
		session = require('express-session'),
		SessionStore = require('connect-diskdb')(session);

	// create a DiskDB Session Store
	var options = {
		path: '', // path where the diskDB based file should be stored
		name: '', // name of the database
		db: '' // (optional) instead of passing 'path' and 'name' for the db, an existing diskDB instance can be passed.
	};
	var diskDBSessionStore = new SessionStore(options);	

	// enable sessions with diskDBSessionStore
	app.use(session({
		secret: 'MY_SECRET',
		store: diskDBSessionStore 
	}));

	// start the app
	app.listen(8080);	
```

### Debug
To enable 'connect-diskdb' debug logs in your app use 'connect:diskdb' as Node Debug environment.
Example: `NODE_DEBUG=connect:diskdb node index.js`