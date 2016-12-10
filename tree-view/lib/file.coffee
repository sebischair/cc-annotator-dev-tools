path = require 'path'
fs = require 'fs-plus'
{CompositeDisposable, Emitter} = require 'event-kit'
{repoForPath} = require './helpers'

module.exports =
class File
  constructor: ({@name, fullPath, @symlink, realpathCache, useSyncFS, @stats}) ->
    @destroyed = false
    @emitter = new Emitter()
    @subscriptions = new CompositeDisposable()

    @path = fullPath
    @realPath = @path

    @subscribeToRepo()
    @updateStatus()

    if useSyncFS
      @realPath = fs.realpathSync(@path)
    else
      fs.realpath @path, realpathCache, (error, realPath) =>
        return if @destroyed
        if realPath and realPath isnt @path
          @realPath = realPath
          @updateStatus()

    directoryPath = path.dirname(@path)
    annotatorFile = path.join(directoryPath, ".annotator")
    console.log(directoryPath)
    try
      fs.accessSync(annotatorFile)
      @isAnnotated = @getAnnotationsinFile(annotatorFile)
      console.log("Is Annotated: " + @isAnnotated)
    catch error
      @isAnnotated = false
      console.log(error)

  destroy: ->
    @destroyed = true
    @subscriptions.dispose()
    @emitter.emit('did-destroy')

  onDidDestroy: (callback) ->
    @emitter.on('did-destroy', callback)

  onDidStatusChange: (callback) ->
    @emitter.on('did-status-change', callback)

  # Subscribe to the project's repo for changes to the Git status of this file.
  subscribeToRepo: ->
    repo = repoForPath(@path)
    return unless repo?

    @subscriptions.add repo.onDidChangeStatus (event) =>
      @updateStatus(repo) if @isPathEqual(event.path)
    @subscriptions.add repo.onDidChangeStatuses =>
      @updateStatus(repo)

  setAnnotated: (hasAnnotation) ->
    @isAnnotated = hasAnnotation

  getAnnotated: ->
    @isAnnotated

  # Update the status property of this directory using the repo.
  updateStatus: ->
    repo = repoForPath(@path)
    return unless repo?

    newStatus = null
    if repo.isPathIgnored(@path)
      newStatus = 'ignored'
    else
      status = repo.getCachedPathStatus(@path)
      if repo.isStatusModified(status)
        newStatus = 'modified'
      else if repo.isStatusNew(status)
        newStatus = 'added'

    if newStatus isnt @status
      @status = newStatus
      @emitter.emit('did-status-change', newStatus)

  isPathEqual: (pathToCompare) ->
    @path is pathToCompare or @realPath is pathToCompare

  getAnnotationsinFile: (fileName) ->
    fileHasAnnotatations = false
    json = fs.readFileSync(fileName)
    data = JSON.parse(json)
    annotatedFiles = data.annotated_files
    filesList = []
    console.log("Getting annotations...")
    for entry in annotatedFiles
      console.log("Entry " + entry.name)
      console.log("Name " + @name)
      if(entry.name == @name)
        fileHasAnnotatations = true
    return fileHasAnnotatations
