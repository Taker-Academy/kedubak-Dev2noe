const mongoose = require('mongoose');
const user_schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    lastUpVote: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - 1);
            return now;
        },
    },
});

const User = mongoose.model('User', user_schema);
module.exports = User;

const post_schema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: String,
        require: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    comments: {
        type: Array,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        id: {
            type: String,
            require: true,
        },
    },

})
