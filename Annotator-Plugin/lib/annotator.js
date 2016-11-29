'use babel';

import AnnotatorView from './annotator-view';
import query from './handler/query';
import decoration from './handler/decoration';
import comment from './handler/comment';
import storage from './handler/storage';
import { CompositeDisposable } from 'atom';
import request from 'request';

$ = jQuery = require('jquery')
fs = require ('fs-plus')

export default {

  annotatorView: null,
  modalPanel: null,
  subscriptions: null,
  server_url: "http://127.0.0.1:8080",
  annotations_code: [],

  activate(state) {
    self = this
    this.annotatorView = new AnnotatorView(state.annotatorViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.annotatorView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'annotator:annotate_code': () => this.annotate_code()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'annotator:annotate_comment': () => this.annotate_comment()
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

  annotate_comment() {
    self = this
    let editoR
    if (editoR = atom.workspace.getActiveTextEditor()){

      self.editoR = editoR
      var content = comment.generate_base_content(editoR);

      url_sentiment = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment"
      // No sentiment for German language
      query.ms_services(url_sentiment, content).then((response) => {
        atom.notifications.addSuccess("1")
        comment.update_content_sentiment(content, response)
        overall_sentiment = comment.calc_overall_sentiment(response)

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
        atom.notifications.addWarning(JSON.stringify(err))

      })/**/

      url_key_phrases = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/keyPhrases"
      query.ms_services(url_key_phrases, content).then((response) => {
        comment.update_content_keyphrases(content, response)
      }).catch((err) => {
        console.log("ERROR: "+JSON.stringify(err))
      })/**/

      return
    }
  },

  /* WEBAPP Praktikum */
  annotate_code() {
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
      query.sebis_services(url_sentiment, content).then((response) => {
            atom.notifications.addSuccess(response)

            response_parsed = JSON.parse(response)
            var smells = response_parsed.data

            for (var i = 0; i < smells.length; i++){
              var smell = smells[i]
              smell = decoration.annotation_smell(smell, editoR)
              self.annotations_code.push(smell)
              atom.notifications.addInfo(JSON.stringify(smell))
            }
      }).catch((err) => {
        console.log("ERROR: "+JSON.stringify(err))
      })/**/

      editoR.onDidChangeCursorPosition(function(event){
            var cursor = event.cursor
            var position = event.cursor.getBufferPosition();
            self.clicked_annotated_line_number(position, function (smell) {
                atom.notifications.addWarning(smell.name+" at line " +position.row)
            });

      });
    }
  },

  get_range(smell, file_content) {
    var prev_content = file_content.substring(smell.begin)
    var line = (prev_content.match(/\n/g) || []).length;
  },

  clicked_annotated_line_number(position, callback){
      var row = position.row - 1
      if (position.column == 0) {

          for(var i = 0; i < this.annotations_code.length; i++){
              var smell = this.annotations_code[i]
              var rows = smell.rows
              if (this.isInArray(row, rows)) {
                callback(smell)
              }
          }
      }

      return false

  },

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

};
