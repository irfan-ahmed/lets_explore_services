/**
 * Created by irahmed on 12/12/16.
 */

requirejs.config({
  "baseUrl": "js/lib",
  "paths": {
    "app": "../app",
    "jquery": "//ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min"
  }
});

// Load the main app module to start the app
requirejs(["app/main"]);