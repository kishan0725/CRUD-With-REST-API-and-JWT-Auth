const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        maxlength: 20
    },
    desc: {
        type: String,
        required: [true, 'Description is required']
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Posts', PostSchema);