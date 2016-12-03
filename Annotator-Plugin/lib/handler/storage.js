'use babel';

fs = require ('fs-plus')
fs_o = require('fs');


module.exports =  {

  hashFile: function(path) {
    var file_content = fs.readFileSync(path).toString('utf8');
    return this.createHash(file_content);
  },

  createHash: function(content){
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    var result = ""
    hash.on('readable', () => {
      var data = hash.read();
      if (data)
        result = data.toString('hex');
    });

    hash.write(content);
    hash.end();

    return result;
  },

  load_json: function(path) {
    var file_content = fs.readFileSync(path).toString('utf8');
    return JSON.parse(file_content);
  },

  store_json: function(path, json) {
    fs.writeFile(path, JSON.stringify(json, undefined, 2))
  },

  /*
  * The file ending is expected to define the programming language used
  * in the file.
  */
  get_file_lang: function(file_name){
    var file_type = file_name.substring(file_name.lastIndexOf("\.") + 1)
    return file_type
  },

  store_annotator_file: function(file_to_store, result){
    var base_path = file_to_store.substring(0, file_to_store.lastIndexOf("/")+1)
    var annotator_file = base_path + ".annotator"
    if (this.isFile(annotator_file)){
      var content = this.load_json(annotator_file)
      content = this.update_content(content, result)
      this.store_json(annotator_file, content)
    } else {
      var content = this.generate_annotator_content(result)
    }
    return
  },

  isFile(file_to_path){
    // TODO Check if file exists
    return false;
  },

  update_content(content, result){
    // TODO Update content
    return content;
  },

  generate_annotator_content(result){
    // TODO generate new annotator file content.
    return result;
  }
}
