const mongoose = require('mongoose');

const DB_NAME = 'ejournalmoko';
const COLLECTION_NAME = 'Post';

const DB_ADMIN_USERNAME = 'ejourmalmoko-admin';
const DB_ADMIN_PASSWORD = process.env.DB_PASSWORD;

mongoose.connect(`mongodb+srv://ejournalmoko-admin:${DB_ADMIN_PASSWORD}@ejournalmoko.sofzm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
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

