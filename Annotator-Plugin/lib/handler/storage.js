'use babel';

module.exports =  {

  hashFile: function(path) {
    var file_content = fs.readFileSync(path).toString('utf8');
    return this.createHash(file_content);
  }

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
  }

  load_json: function(path) {
    var file_content = fs.readFileSync(path).toString('utf8');
    return JSON.parse(file_content);
  }


}
