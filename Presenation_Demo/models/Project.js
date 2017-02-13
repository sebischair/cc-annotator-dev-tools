/**
 * Created by Arman on 11/12/2015.
 */

var stepSchema = new mongoose.Schema({
    text: { type: String, default: '' },
    picture: { type: String, default: '' }
});

var ProjectSchema = new Schema({
    title: { type: String, required: true},
    creator: { type: String, required: true},
    cover: { type: String, default: '' },
    creatorName: String ,
    channel: { type: String, default: 'PUBLIC', uppercase : true },
    steps: [stepSchema],
    tags: [String],
    likes: { type: Number, default: 0 },
    mades: { type: Number, default: 0 },
    supplies: [{
        quantity: Number,
        supply: String
    }],
    admin: {
        comment: { type: String, default: '' },
        lastProgress: { type: String, default: '' },
    }
});

module.exports = mongoose.model("Project", ProjectSchema);
