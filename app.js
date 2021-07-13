const express = require('express');
const _ = require('lodash');

// Start user defined modules
const strHelper = require(`${__dirname}/modules/stringHelper.js`);
const dateHelper = require(`${__dirname}/modules/dateHelper.js`);
const odm = require(`${__dirname}/modules/mongoose.js`);
// End user defined modules

const app = express();

app.set('view engine', 'ejs');
app.set("views", __dirname + '/views');

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

// Start starting variables
const about = "In urna mi, posuere nec scelerisque a, pharetra elementum eros. Donec congue mattis libero, sed venenatis eros semper in. Nullam vitae elit suscipit, volutpat tortor ac, sagittis lectus. Curabitur efficitur nunc tellus, vulputate blandit tortor dignissim eu. Donec et fermentum mauris, sed ullamcorper nibh. Morbi consectetur sollicitudin lectus, faucibus congue erat placerat id. Cras consectetur ac nulla at pharetra.";
const contact = "Nunc nunc erat, molestie a nisl et, facilisis vestibulum arcu. Nulla sit amet mauris est. Aenean sed dolor eu massa pellentesque lobortis maximus eu dolor. Nunc non justo ex. Quisque scelerisque eros ac viverra pulvinar. Etiam pharetra, nisl eget luctus efficitur, lorem tellus viverra augue, in tincidunt augue orci eget tortor. Curabitur gravida eros vel maximus fringilla. Proin pulvinar pharetra ligula. In tincidunt eleifend enim, et vestibulum lorem laoreet eu. Donec tristique ipsum non pretium feugiat. Proin sodales dapibus elit ac hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec orci ipsum, facilisis nec scelerisque nec, vestibulum at ipsum.";

const categories = ['general', 'technology', 'politics', 'socialMedia', 'lifestyle']

// End starting variables

// Start Get routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/posts/:category', (req, res) => {
    
    const postCateg = req.params.category;
    
    if (!categories.includes(_.camelCase(postCateg))){
        res.redirect('/')
    } else {

        // find
        odm.PostModel.find({
            category: _.camelCase(postCateg)
        }, 'message date', (err, data) => {

            if (data === undefined || data === null){
                res.redirect('/');
            }
            else {
                res.render('posts', {
                    postCategory: _.startCase(postCateg),
                    posts: data
                });
            }

        });

    }

});

app.get('/about', (req, res) => {
    res.render('about', {
        about:about
    });
});

app.get('/contactus', (req, res) => {
    res.render('contactus', {
        contact:contact
    });
});

app.get('/compose', (req, res) => {
    res.render('compose');
});

app.get('/post/:postId', (req, res) =>{

    var postId = req.params.postId;
    
    // console.log(postId);
    // find by id
    odm.PostModel.findById(postId, 'message date', (err, data) => {
        if (data === undefined || data === null){
            res.redirect('/');
        } else {
            res.render('post', {
                post: data
            });
        }
    });
});
// End Get Routes

// Start Post Routes
app.post('/compose', (req, res) =>{
    
    const composedMsg = req.body.composed;
    let category = _.camelCase(req.body.category);

    if (strHelper.isEmpty(composedMsg)){
        res.redirect("/compose");
    } else if (!categories.includes(category)) {
        res.redirect("/compose");
    } else {

        // Db Posting
        // error encountered when we post for the second time
        // in a single runtime
        // but this new implementation solved the problem
        // reference: https://thoughtspeed7.medium.com/reusing-mongoose-schema-1f83a5c10caf
        const post = new odm.PostModel({
            message: composedMsg,
            date: dateHelper.dateToday(),
            category: category
        });
        post.save().then(() => {
            console.log('New record inserted');

            res.redirect(`/posts/${category}`);
        });
    }
});
// End Post Routes

// Admin Routes

app.get('/admin/manage', (req, res) => {

    odm.PostModel.find({}, (err, data) => {

        const formattedData = _.chain(data)
        // Group the elements of Array based on `color` property
        .groupBy("category")
        // `key` is group's name (color), `value` is the array of objects
        .map((postsList, categoryKey) => ({ category: _.startCase(categoryKey), posts: postsList }))
        .value();

        res.render('admin/manage', {
            posts: formattedData
        });

    });
});

app.get('/admin/archive/:postId', (req, res) => {

    console.log(req.params.postId);

    res.end();
});

app.post('/admin/edit', (req, res) => {
    const postId = req.body.postId;

    odm.PostModel.findById(postId, (err, post) => {
        
        if (err || post === null || post === undefined){
            res.redirect('/admin/manage');
        } else{ 
            res.render('admin/edit', {
                post: post
            });
        }

    });
});

app.post('/admin/edit/post', (req, res) => {
    const postId = req.body.postId;
    const newMessage = req.body.postMessage;

    odm.PostModel.findByIdAndUpdate(postId, { $set: { message: newMessage }}, (err) => {
        if (err){
            console.log(err);
            res.redirect('admin/manage');
        } else{
            res.redirect('/post/' + postId);
        }
    });
});

// app.post('/admin/update');
// End admin routes

let port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Blog application listening to port ${port}`));