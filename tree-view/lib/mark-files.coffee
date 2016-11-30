{CompositeDisposable} = require 'event-kit'

module.exports =
class AnnotateFile
  markfile: ->
    atom.notifications.addInfo("Hello World!", options)
