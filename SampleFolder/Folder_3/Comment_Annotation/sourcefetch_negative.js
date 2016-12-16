'use babel';

import SourcefetchView from './sourcefetch-view';
import { CompositeDisposable } from 'atom';
import request from 'request'
import cheerio from 'cheerio'
import google from 'google'

fs = require ('fs-plus')
path = require('path')


google.resultsPerPage = 1

export default {

  sourcefetchView: null,
  modalPanel: null,
  subscriptions: null,
  cachedDecorations: [],

  // Very shitty function
  activate(state) {
    this.sourcefetchView = new SourcefetchView(state.sourcefetchViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.sourcefetchView.getElement(),
      visible: false
    });

    self = this
    this.text_editor_observer = atom.workspace.observeTextEditors(function(editoR){
        self.handleEditor(editoR);
    });

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sourcefetch:fetch': () => this.fetch()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sourcefetch:color': () => this.color()
    }));

  },

  // Deactivate destroys that shit!
  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.sourcefetchView.destroy();
  },

  serialize() {
    return {
      sourcefetchViewState: this.sourcefetchView.serialize()
    };
  },

  // This shitty method will get you a crapy example code from stackoverflow
  fetch() {
    let editor
    let self = this
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      let language = editor.getGrammar().name
      self.search(selection, language).then((url) => {
              atom.notifications.addSuccess("Found google results!")
              return self.download(url)
      }).then((html) => {
          let answer = self.scrape(html)
          if (answer === ''){
            atom.notifications.addWarning("Could not find answer")
          } else {
            atom.notifications.addSuccess("Found snippet")
            editor.insertText("START INSERT\n"+answer+"END INSERT")
            editor.
            marker = editor.markBufferRange([[0, 0], [2, 3]])
            decoration = editor.decorateMarker(marker, {type: 'line', class: '{color: red}'})
          }
      }).catch((error) => {
        atom.notifications.addWarning(error.reason)
      })
    }
  },

  // I don't know this might be bad or at least not good
  search(query, language) {
      return new Promise((resolve, reject) => {
        let searchString = `${query} in ${language} site:stackoverflow.com`

        // Asking the spying bastards
        google(searchString, (err, res) => {
          if (err) {
            reject({
              reason: 'A search error has occured :('
            })
          } else if (res.links.length === 0) {
            reject({
              reason: 'No results found :('
            })
          } else {
            resolve(res.links[0].href)
          }
        })
      })
  },

  scrape(html) {
    $ = cheerio.load(html)
    return $('div.accepted-answer pre code').text()
  },

  // Downloading random stuff nothing important.
  download(url) {
    return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(body)
        } else {
          reject({
            reason: 'Unable to download page'
          })
        }
      })
    })
  },

  // md5 is shit.
  // Better use sha256. It is more really good
  createHash(input){
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    var result = ""
    hash.on('readable', () => {
      var data = hash.read();
      if (data)
        result = data.toString('hex');
    });

    hash.write(input);
    hash.end();

    return result;
  },

  destroyAll(dec,  index){
      dec.destroy()
  },

  // To use not needed bullshit promises is awesome!
  post_data_with_promise(){
    new Promise((resolve, reject) => {
      request("http://localhost:8080/annotate", (error, response, body) => {
        if (!error && response.statusCode == 200) {
          atom.notifications.addSuccess(body)
        } else {
          reject({
            reason: 'Unable to download page'
          })
        }
      })
    })
  },

  color_annotation(annotation, editoR) {

    line = annotation.line

    range = [[line-1,0],[line-1,1]]
    marker = editoR.markBufferRange(range)
    decoration = editoR.decorateMarker(marker, {type: 'line-number', class: 'line-number-red'})

    atom.notifications.addSuccess("Colored line: "+JSON.stringify(annotation.line))

  },

  // Handles fucking shit editors. On annoying changes by shitty users.
  handleEditor(editoR){
    try {

      var path = editoR.getPath()
      var base_path = path.substring(path.lastIndexOf("/") + 1);
      var annotator_path = path.substring(0,path.lastIndexOf("/") + 1)+".annotator";
      var annotator_content = JSON.parse(fs.readFileSync(annotator_path).toString('utf8'));
      var annotated_files = annotator_content.annotated_files

      atom.notifications.addWarning(JSON.stringify(annotated_files))

      var found_file = false
      var file_data = undefined
      console.log("Editor: "+editoR.getTitle())
      for (index = 0, len = annotated_files.length; index < len; index++){
        file = annotated_files[index]
        console.log(index+" File: "+ file.name)
        if (file.name === base_path) {
          found_file = true
          file_data = file
          console.log("FoundFile")
        }
      }

      if (found_file){
        hash_new = this.createHash(fs.readFileSync(path).toString('utf8'));
        if (file_data.hash === hash_new){
            atom.notifications.addInfo("Still same hash");
        } else {
            self.post_dummy_data(editoR);
            atom.notifications.addInfo("Reannotate!");
        }

      } else {
        // Not found the ass of a   file.
        atom.notifications.addInfo("Did not found file!")
        self.post_dummy_data(editoR);
      }

    } catch(e){
        atom.notifications.addError(JSON.stringify(e))
    }
  },

  post_dummy_data (editoR){

    self = this
    self.editor = editoR
    xhr = new XMLHttpRequest();
    var url = "http://localhost:8080/annotate";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function() {

        if (xhr.readyState == XMLHttpRequest.DONE) {
            response = JSON.parse(xhr.responseText);

            path = editoR.getPath()
            filename = path.substring(path.lastIndexOf("/") + 1);
            atom.notifications.addSuccess("Annotated File: "+JSON.stringify(filename)+" - "+JSON.stringify(response.id));

            annotations = response.annotations
            annotations.forEach( function(annotation) {
              self.color_annotation(annotation, self.editor);
              self.update_file(annotation, path);
            });

        }
    }

    path = editoR.getPath()
    filename = path.substring(path.lastIndexOf("/") + 1);
    hash = this.createHash(fs.readFileSync(path).toString('utf8'));
    lang = filename.substring(filename.lastIndexOf(".") + 1);
    user = 'Max'
    content = fs.readFileSync(path).toString('utf8');

    dummy_json = {"id": "1234567", 'hash': hash, 'user': user, 'name': filename, 'lang': lang,
        'file': content}

    var data = JSON.stringify(dummy_json);

    xhr.send(data);
  },

  update_file(annotation, path) {
    try{
      annotator_path = path.substring(0,path.lastIndexOf("/") + 1)+".annotator";
      annotator_content = fs.readFileSync(annotator_path).toString('utf8');

      atom.notifications.addSuccess(annotator_content)
    } catch(e){
      atom.notifications.addError("Could not open .annotator! Please annotate file!")
    }
  },

  color () {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {

      if (this.cachedDecorations.length > 0) {
          this.cachedDecorations.forEach(this.destroyAll)
      }

      range = editor.getSelectedBufferRange()
      marker = editor.markBufferRange(range)
      decoration = editor.decorateMarker(marker, {type: 'line-number', class: 'line-number-blue'})
      this.cachedDecorations.push(decoration)
      this.handleEditor(editor)
    }
  }

};
