'use babel';

fs = require ('fs-plus')
import decoration from '../handler/decoration';

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

      var last_line_comment = -2
      var start_line = -2
      var comment = ""

      for (i = 0; i < lines.length; i ++){
          var line = lines[i]


          if (line.includes("://") || line.includes("\"//\"")){
            continue;
          }

          if (line.includes("//")){
              /*if (start_line === -2){
                start_line = i
              }/**/
              comment = line
              //comment += " \n"+line.replace("//", "").trim()
              //last_line_comment = i
              documents.push({
                "language": "en",
                "id": i,
                "text": comment,
                "score": 0.5,
                "key_phrases": []
              })

          }
          /* else if (comment != "" && last_line_comment + 1 != i) {
            documents.push({
              "language": "en",
              "id": i - 1,
              "start_line": start_line,
              "end_line": i - 1,
              "text": comment.trim(),
              "score": 0.5,
              "key_phrases": []
            })

            start_line = -2
            comment = ""
          }/**/
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
    },

    update_content_sentiment: function(content, response) {
      var response_docs = JSON.parse(response).documents
      for (var i = 0; i < response_docs.length; i++) {
        content.documents[i].score = response_docs[i].score
        decoration.annotation_line(content.documents[i], self.editoR)
      }
    },

    calc_overall_sentiment: function(response) {
      var response_docs = JSON.parse(response).documents

      var overall_sentiment = 0;
      for (var i = 0; i < response_docs.length; i++) {
        overall_sentiment += response_docs[i].score
      }

      overall_sentiment = overall_sentiment / response_docs.length

      return overall_sentiment
    },

    update_content_keyphrases: function(content, response) {
      var response_docs = JSON.parse(response).documents

      for (var i = 0; i < response_docs.length; i++) {
        content.documents[i].key_phrases = response_docs[i].keyPhrases
        decoration.annotation_key(content.documents[i], self.editoR)
      }

    }
}
