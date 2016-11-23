'use babel';

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

  }


}
