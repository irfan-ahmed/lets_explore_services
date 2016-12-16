## Events Service

#### Config
Before deployment, make sure you have created a `config.js` file containing the following

1. __key__: The key for the eventful API
2. __port__: The port on which to run the service at

##### Example config.js
```
module.exports = {
  key: "YOUR_EVENTFUL_API_KEY",
  port: 8083
};
```