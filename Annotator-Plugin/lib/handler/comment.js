'use babel';

fs = require ('fs-plus')

module.exports =  {
      generate_base_content: function(editoR){
      var path = editoR.getPath()
      var file_content = fs.readFileSync(path).toString('utf8')
      var documents = []
      var lines = file_content.split("\n")

      if (this.isJavaCommentStyle(path)){
        atom.notifications.addInfo("Java")
        documents = this.extractJavaCommentStyle(lines)
      }

      if (this.isBashCommentStyle(path)){
        atom.notifications.addInfo("Bash")
        documents = this.extractBashCommentStyle(lines)
      }

      if (this.isMCRCommentStyle(path)){
        atom.notifications.addInfo("MCR")
        documents = this.extractMCRCommentStyle(lines)
      }

      return {
        documents: documents
      }
    },

    isJavaCommentStyle(path) {
        return path.endsWith('java') || path.endsWith('js') || path.endsWith('go')
    },

    isBashCommentStyle(path) {
        return path.endsWith('sh') || path.endsWith('tcl')
    },

    isMCRCommentStyle(path) {
        return path.endsWith('MCR') || path.endsWith('mcr')
    },

    extractJavaCommentStyle(lines) {
      var documents = []

      for (i = 0; i < lines.length; i ++){
          if (lines[i].includes("://") || lines[i].includes("\"//\"")){
            continue;
          }
          if (lines[i].includes("//")){
            documents.push({
              "language": "en",
              "id": i,
              "text": lines[i],
              "score": 0.5,
              "key_phrases": []
            })
          }
      }

      return documents

    },

    extractBashCommentStyle(lines) {
      var documents = []

      for (i = 0; i < lines.length; i ++){
          if (lines[i].includes("\"#\"")){
            continue;
          }
          if (lines[i].includes("#")){
            documents.push({
              "language": "de",
              "id": i,
              "text": lines[i],
              "score": 0.5,
              "key_phrases": []
            })
          }
      }
      return documents;
    },

    extractMCRCommentStyle(lines) {
      var documents = []

      for (i = 0; i < lines.length; i ++){
          if (lines[i].trim().startsWith("'")){
            documents.push({
              "language": "de",
              "id": i,
              "text": lines[i],
              "score": 0.5,
              "key_phrases": []
            })
          }
      }
      return documents;
    }
}
