const express = require('express');
const _ = require('lodash');

// Start user defined modules
const strHelper = require(`${__dirname}/modules/stringHelper.js`);
const dateHelper = require(`${__dirname}/modules/dateHelper.js`);
const odm = require(`${__dirname}/modules/mongoose.js`);
// End user defined modules

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));

// Start starting variables
const about = "In urna mi, posuere nec scelerisque a, pharetra elementum eros. Donec congue mattis libero, sed venenatis eros semper in. Nullam vitae elit suscipit, volutpat tortor ac, sagittis lectus. Curabitur efficitur nunc tellus, vulputate blandit tortor dignissim eu. Donec et fermentum mauris, sed ullamcorper nibh. Morbi consectetur sollicitudin lectus, faucibus congue erat placerat id. Cras consectetur ac nulla at pharetra.";
const contact = "Nunc nunc erat, molestie a nisl et, facilisis vestibulum arcu. Nulla sit amet mauris est. Aenean sed dolor eu massa pellentesque lobortis maximus eu dolor. Nunc non justo ex. Quisque scelerisque eros ac viverra pulvinar. Etiam pharetra, nisl eget luctus efficitur, lorem tellus viverra augue, in tincidunt augue orci eget tortor. Curabitur gravida eros vel maximus fringilla. Proin pulvinar pharetra ligula. In tincidunt eleifend enim, et vestibulum lorem laoreet eu. Donec tristique ipsum non pretium feugiat. Proin sodales dapibus elit ac hendrerit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec orci ipsum, facilisis nec scelerisque nec, vestibulum at ipsum.";

let postCount = 0;
// changed key to string, which would allow dynamic access based on variable value
let posts = {
    "general": [{
        postId: 1,
        date: '8 July 2021, 6:40 PM',
        message: '542 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus fermentum dui, et porta diam lacinia a. Vestibulum mi quam, viverra vel metus finibus, gravida finibus elit. Pellentesque posuere, leo sit amet luctus consectetur, orci dolor digniss'
    }],
    "technology": [],
    "politics": [],
    "socialMedia": [],
    "lifestyle": []
}

const categories = ['general', 'technology', 'politics', 'socialMedia', 'lifestyle']

// End starting variables

// Start Get routes
app.get('/', (req, res) => {

    odm.insertPost({
        message: 'm2',
        date: 'd2',
        category: 'c2'
    }, (newPostId) => {
        console.log("New Post with id " + newPostId);
    });
    
    res.end();    
});

app.get('/posts/:category', (req, res) => {
    
    const postCateg = req.params.category;
    
    if (categories.includes(_.camelCase(postCateg))){
        res.render('posts', {
            postCategory: _.startCase(postCateg),
            posts: posts[_.camelCase(postCateg)]
        });
    } else {
        res.redirect('/')
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

app.get('/posts/:postId', (req, res) =>{
    
    const toView = posts[parseInt(req.params.postId)];

    if (toView === undefined){
        res.redirect('/');
    } else {
        res.render('post', {
            post: toView
        });
    }
});

// End Get Routes

// Start Post Routes

app.post('/compose', (req, res) =>{
    
    const composedMsg = req.body.composed;
    let category = _.camelCase(req.body.category);

    if (strHelper.isEmpty(composedMsg)){
        res.redirect("/compose");
    } else if (!categories.includes(category)) {
        // how to re render
    } else {

        const newPost = {
            date: dateHelper.dateToday(),
            message: composedMsg
        };

        posts[category].push(newPost);

        res.redirect(`/posts/${category}`);
    }
});

// End Post Routes

let port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Blog application listening to port ${port}`));