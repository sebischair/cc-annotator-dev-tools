{CompositeDisposable} = require 'event-kit'
FileIcons = require './file-icons'

module.exports =
class PaneView extends HTMLElement
  initialize: (@name) ->
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

module.exports = document.registerElement('tree-view-annotation', prototype: PaneView.prototype, extends: 'li')
