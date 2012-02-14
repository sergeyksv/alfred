module.exports.run = function(next) {
  
  var assert = require('assert'),
      sys    = require('util') || require('sys'),
      fs     = require('fs'),
      random = require('../tools/random_generator');
  
  var file_path = __dirname + '/../tmp/flush_on_exit_test.alf';
      
  if (process.env._ALBERT_TEST_FLUSH_CHILD) {
    require(__dirname + '/../lib/alfred/key_map.js').open(file_path, function(err, key_map) {

      if (err) { next(err); return; }

      var map = {};
      var key_count = 0;

      key_map.clear(function(err) {
        if (err) { next(err); return; }
        for (var i = 0; i < 25; i ++) {
          (function(i){
            var value = random.createRandomObject();
            var key = random.createRandomString(16);
            map[key] = value;
            key_map.put(key, value, function(err) {
              if (err) { next(err); return; }
              key_count ++;
              if (key_count == 25) {
                key_map.end(function(err) {
                  if (err) { next(err); return; }
                  next();
                  process.exit();
                });
              }
            });
          })(i);
        }
      });
    });
    
  } else {
    var child_process = require('child_process');
    var child_env = {};
    for(var env_var in process.env) {
      child_env[env_var] = process.env[env_var];
    }
    child_env._ALBERT_TEST_FLUSH_CHILD = true;
    var exec = process.argv[0];
    process.argv.splice(0, 1);
    var child = child_process.spawn(exec, process.argv, {env: child_env});
    child.stdout.on('data', function(data) {
      console.log('child said: ' + data.toString());
    });
    child.stderr.on('data', function(data) {
      console.log('child error: ' + data.toString());
    });
    child.on('exit', function() {
      fs.readFile(file_path, 'utf-8', function(err, file_data) {
        if (err) { next(err); return; }
        var lines = file_data.split("\n");
        assert.equal(25 * 2 + 1, lines.length); // expect that the file contains 25 records plus an end-of-line, making the last one empty
        next();
      });
    });
  }
};