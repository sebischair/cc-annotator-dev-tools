/**
 * Created by Arman on 11/12/2015.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var searchPlugin = require('mongoose-search-plugin');

var stepSchema = new mongoose.Schema({
    text: { type: String, default: '' },
    picture: { type: String, default: '' }
});

var materialSchema = new Schema({
    _id: {type: String},
    category: { type: String, required: true},
    name: { type: String, required: true},
    quantity: { type: Number, required: true, default: 0},
    channel: {type: String, required: true, default: ""},
    lastOrder: {type: String, required: false, default: ""}
});

module.exports = mongoose.model("Material", materialSchema);
