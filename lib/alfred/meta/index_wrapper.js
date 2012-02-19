var IndexWrapper = function(key_map, index_name) {
  this.key_map = key_map;
  this.index_name = index_name;
};

module.exports.create = function(key_map, index_name) {
  return new IndexWrapper(key_map, index_name);
};

IndexWrapper.prototype.filter = function(filter_function, callback, null_on_not_found) {
  return this.key_map.filter(this.key_map.getIndex(this.index_name), filter_function, callback, null_on_not_found);
};

IndexWrapper.prototype.filterSync = function(filter_function, callback, null_on_not_found) {
  return this.key_map.getIndex(this.index_name).filterSync(filter_function);
};

IndexWrapper.prototype.range = function(start, end, callback) {
  return this.key_map.range(this.key_map.getIndex(this.index_name), start, end, callback);
};

IndexWrapper.prototype.rangeSync = function(start, end, exclusive_start, exclusive_end) {
  return this.key_map.getIndex(this.index_name).rangeSync(start, end, exclusive_start, exclusive_end);
};

IndexWrapper.prototype.countFilter = function(filter_function, callback) {
  return this.key_map.countFilter(this.key_map.getIndex(this.index_name), filter_function, callback);
};

IndexWrapper.prototype.indexMatch = function(value, callback) {
  return this.key_map.indexMatch(this.key_map.getIndex(this.index_name), value, callback);
};

IndexWrapper.prototype.indexMatchSync = function(value) {
  return this.key_map.getIndex(this.index_name).matchSync(value);
};