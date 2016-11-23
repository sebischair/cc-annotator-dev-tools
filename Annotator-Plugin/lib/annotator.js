'use babel';

import AnnotatorView from './annotator-view';
import query from './handler/query';
import decoration from './handler/decoration';
import { CompositeDisposable } from 'atom';
import request from 'request';

$ = jQuery = require('jquery')
fs = require ('fs-plus')

export default {

  annotatorView: null,
  modalPanel: null,
  subscriptions: null,
  server_url: "http://127.0.0.1:8080",

  activate(state) {
    this.annotatorView = new AnnotatorView(state.annotatorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.annotatorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'annotator:annotate': () => this.annotate_smells()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.annotatorView.destroy();
  },

  serialize() {
    return {
      annotatorViewState: this.annotatorView.serialize()
    };
  },

  annotate() {
    self = this
    let editoR
    if (editoR = atom.workspace.getActiveTextEditor()){

      self.editoR = editoR
      var content = self.generate_base_content(editoR);

      url_sentiment = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"
      query.ms_services(url_sentiment, content).then((response) => {

        var response_docs = JSON.parse(response).documents
        var overall_sentiment = 0;
        for (var i = 0; i < response_docs.length; i++) {
          content.documents[i].score = response_docs[i].score
          overall_sentiment += response_docs[i].score
          decoration.annotation_line(content.documents[i], self.editoR)
        }

        overall_sentiment = overall_sentiment / response_docs.length
        return overall_sentiment

      }).then((sentiment) => {

        if (sentiment < 0.4){
            atom.notifications.addWarning("The overall sentiment is negative!")
        } else if (sentiment < 0.6) {
            atom.notifications.addInfo("The overall sentiment is neither positive nor negative!")
        } else {
            atom.notifications.addSuccess("The overall sentiment is positive!")
        }

      }).catch((err) => {
        console.log("ERROR: "+JSON.stringify(err))
      })/**/

      url_key_phrases = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases"
      query.ms_services(url_key_phrases, content).then((response) => {
        var response_docs = JSON.parse(response).documents

        for (var i = 0; i < response_docs.length; i++) {
          content.documents[i].key_phrases = response_docs[i].keyPhrases
          decoration.annotation_key(content.documents[i], self.editoR)
        }
      }).catch((err) => {
        console.log("ERROR: "+JSON.stringify(err))
      })/**/

      return
    }
  },

  generate_base_content(editoR){
    var path = editoR.getPath()
    var file_content = fs.readFileSync(path).toString('utf8')
    var documents = []
    var lines = file_content.split("\n")

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
    return {
      documents: documents
    }
  },

  update_content_sentiment(content, response) {
    var response_docs = JSON.parse(response).documents
    for (var i = 0; i < response_docs.length; i++) {
      atom.notifications.addSuccess(JSON.stringify(response_docs[i]))
      atom.notifications.addSuccess(JSON.stringify(content))
      content.documents[i].score = response_docs[i].score
      decoration.annotation_line(content.documents[i], self.editoR)
    }
  },

  update_content_keyphrases(response) {
    var response_docs = JSON.parse(response).documents

    for (var i = 0; i < response_docs.length; i++) {
      self.content.documents[i].key_phrases = response_docs[i].keyPhrases
      decoration.annotation_key(self.content.documents[i], self.editoR)
    }
  },

  /* WEBAPP Praktikum */
  get_range(smell, file_content) {
    atom.notifications.addInfo("HELLO WORLD")
    atom.notifications.addInfo(JSON.stringify(smell))
    atom.notifications.addInfo(JSON.stringify(file_content))
    var prev_content = file_content.substring(smell.begin)
    atom.notifications.addInfo(JSON.stringify(prev_content))
    var line = (prev_content.match(/\n/g) || []).length;
    atom.notifications.addInfo(JSON.stringify(line))
  },

  annotate_smells() {
    self = this
    let editoR
    if (editoR = atom.workspace.getActiveTextEditor()){

      self.editoR = editoR
      var path = editoR.getPath()
      var file_content = fs.readFileSync(path).toString('utf8')

      var content = {
        "content": file_content,
        "progLanguage": "java",
        "fileName": "test.vb",
        "projectId": "5834589c88695d217c1eed1a"
      }

      url_sentiment = "https://spotlight.in.tum.de/processCode"
      atom.notifications.addInfo("Send request")
      query.sebis_services(url_sentiment, content).then((response) => {
            atom.notifications.addSuccess(response)

            response_parsed = JSON.parse(response)
            var smells = response_parsed.data

            for (var i = 0; i < smells.length; i++){
              var smell = smells[i]
              get_range(smell, file_content)
            }
      }).catch((err) => {
        console.log("ERROR: "+JSON.stringify(err))
        atom.notifications.addWarning(err)
      })/**/


    }
  }

};
