'use babel';

fs = require ('fs-plus')

module.exports =  {
  annotation_line: function(annotation, editoR) {

    var line = annotation.id
    var score = annotation.score

    var range = [[line,0],[line,1]]
    var marker = editoR.markBufferRange(range)

    if (score < 0.4) {
        var decoration = editoR.decorateMarker(marker, {type: 'line-number', class: 'line-number-red'})
    } else if (score < 0.6) {
        var decoration = editoR.decorateMarker(marker, {type: 'line-number', class: 'line-number-yellow'})
    } else {
        var decoration = editoR.decorateMarker(marker, {type: 'line-number', class: 'line-number-green'})
    }

  },

  annotation_key: function(annotation, editoR) {

    var line = annotation.id
    var key_phrases = annotation.key_phrases
    var content = annotation.text

    for (var i = 0; i < key_phrases.length; i++){
        // To highlight the important phrases
        var start = content.indexOf(key_phrases[i])
        var length = key_phrases[i].length
        var end = start + length
        var range = [[line, start], [line, end]]
        var marker = editoR.markBufferRange(range)
        var decoration = editoR.decorateMarker(marker, {type: 'highlight', class: 'highlight-blue'})
        atom.tooltips.add(marker, {title: "The package version"})
    }

  },

  annotation_smell (smell, editoR) {

    var path = editoR.getPath()
    var content = fs.readFileSync(path).toString('utf8')

    var splites = content.split(smell.token)
    var line_nr_overall = 0
    for (i = 0; i < splites.length - 1; i ++){
      var lines = splites[i].split("\n")
      line_nr_local = lines.length - 1
      line_nr_overall += line_nr_local
      var line = lines[line_nr_local]
      var begin = line.length
      var end = begin + smell.token.length
      var range = [[line_nr_overall,begin],[line_nr_overall,end]]
      var marker = editoR.markBufferRange(range)
      var decoration_line_nr = editoR.decorateMarker(marker, {type: 'line-number', class: 'line-number-red'})
      var decoration_token = editoR.decorateMarker(marker, {type: 'highlight', class: 'highlight-red'})
    }

  }

}
