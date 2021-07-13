const mongoose = require('mongoose');

const DB_NAME = 'ejournalmoko';
const COLLECTION_NAME = 'Post';

mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

// ref: https://stackoverflow.com/questions/52572852/deprecationwarning-collection-findandmodify-is-deprecated-use-findoneandupdate
mongoose.set('useFindAndModify', false);

// 'Post' schema
const postSchema = new mongoose.Schema({
    //_id is auto created by mongodb
    message: String,
    date: String, // but it should by 'Date' type
    category: String, // tech, general, lifestyle, soc med, politics
    available: Boolean
});

// create the database/model/collection
// document is row of a record
const PostModel = mongoose.model(COLLECTION_NAME, postSchema);

exports.PostModel = PostModel;

