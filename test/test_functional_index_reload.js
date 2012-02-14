module.exports.run = function(next) {
  
  var assert = require('assert'),
      sys    = require('util') || require('sys'),
      key_map_module = require(__dirname + '/../lib/alfred/key_map'),
      random = require('../tools/random_generator');


  var file_path = __dirname + '/../tmp/funcitonal_index_reload_test.alf';
  key_map_module.open(file_path, function(err, key_map) {
    
    if (err) { next(err); return; }

    var createRandomObject = function(a, b) {
      return {
        a: a,
        b: b,
        c: random.createRandomString(random(100))
      };
    };

    var map = {};
    var key_count = 0;
    
    var a_values = [random.createRandomString(random.random(100)), random.createRandomString(random.random(100)), random.createRandomString(random.random(100))];
    var b_values = [random.createRandomString(random.random(100)), random.createRandomString(random.random(100)), random.createRandomString(random.random(100))];
    
    key_map.clear(function(err) {
      if (err) { next(err); return; }
      for (var i = 0; i < 90; i ++) {
        (function(i) {
          var value_index = i % 3;
          var value = createRandomObject(a_values[value_index], b_values[value_index]);
          var key = random.createRandomString(16);
          map[key] = value;
          key_map.put(key, value, function(err) {
            if (err) { next(err); return; }

            key_count ++;
            if (key_count == 90) {
              key_map.end(function(err) {
                if (err) { next(err); return; }

                key_map_module.open(file_path, function(err, key_map) {
                  if (err) { next(err); return; }

                  key_map.addIndex('a', function(record) {
                    //console.log(record);
                    return {
                      e: record.a + record.b,
                      f: record.a + record.c
                    };
                  }, function(err, index) {
                    // done creating the index
                    if (err) { next(err); return; }
                    var idx = random.random(3);
                    var looking_for = a_values[idx] + b_values[idx];
                    var selected = 0;

                    var timeout = setTimeout(function() {
                      assert.ok(false, "key_map.filter timeout. Only selected " + selected + " records");
                    }, 10000);

                    key_map.filter('a', function(record) {
                      //console.log('comparing ' + record.e + ' and ')
                      return record.e == looking_for;
                    }, function(err, key, value) {
                      if (err) { next(err); return; }
                      selected ++;
                      if (selected == 30) {
                        key_map.end(function(err) {
                          if (err) { next(err); return; }
                          clearTimeout(timeout);
                          next();
                        });
                      }
                    });
                  });

                });
              });
            }
          });
        })(i);
      }
    });
  });
};