{CompositeDisposable} = require 'event-kit'

module.exports =
class PaneView extends HTMLElement
  initialize: (@name, @line, @file, @vote, @line_content, @description) ->
    @nameElem = document.createElement('span')
    @nameElem.classList.add('name', 'icon')
    @appendChild(@nameElem)

    @nameElem.textContent = @name
    @nameElem.title = @name

    @lineElem = document.createElement('span')
    @appendChild(@lineElem)

    @lineElem.textContent = @line
    @lineElem.title = @line

  setName: (name) ->
    @name = name

  getName: ->
    return @name

  setLine: (line) ->
    @line = line

  getLine: ->
    return @line

  setFile: (file) ->
    @file = file

  getFile: ->
    return @file

  setVote: (vote) ->
    @vote = vote

  getVote: ->
    return @vote

  setVote: (vote) ->
    @vote = vote

  getVote: ->
    return @vote

  getLineContent: ->
    return @line_content

  getDescription: ->
    return @description

  attach: ->
    atom.workspace.addBottomPanel
      item: this
      priority: 0

module.exports = document.registerElement('side-pane', prototype: PaneView.prototype, extends: 'li')
