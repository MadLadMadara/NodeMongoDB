// load the express package and create our app
var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080;

// ATLIS DB


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://new_admin_123:Mw7hwkdyqPvAiT6o@cluster0.wrhu1.mongodb.net/test?retryWrites=true&w=majority";
// MongoClient.connect(uri, function(err, db){
//     if(err) throw err;
//     console.log('end db stuff');
// });



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:ZpRCeQxTwu6dN9sU@cluster0.wrhu1.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });





// set the port based on environment (more on environments later)
var port = PORT;

// send our index.html file to the user for the home page
app.get('/', function(req, res) {
 res.sendFile(__dirname + '/index.html');
});


// admin router
var adminRouter = express.Router();

// admin main page
adminRouter.get('/', function(req, res){
    res.send('i am the dashboard');
});

app.route('/login')
    // show the form (GET http://localhost:PORT/login)
    .get(function(req, res) {
        var output = 'Processing the login form...'
        var input1 = req.query.input1;
        var input2 = req.query.input2;
        var obj = {"username":input1, "password":input2};
        client.connect(err => {
            const collection = client.db("test").collection("users");
            collection.insertOne(obj, (err, res) => {
                if(err) throw err; 
                console.log('one user added')
            });
            client.close();
          });
       
        console.log(output+', Params:' + input1 + ", "+ input2); 
        
    })
    // process the form (POST http://localhost:PORT/login)
    .post(function(req, res) { console.log('processing');
        res.send('processing the login form!');
 });

// admin middle ware 
adminRouter.use(function(req, res, next){
    // logging
    console.log(req.method, req.url);
    next(); 
});

adminRouter.param('name', function(req, res, next, name){
    // do validation on name here
    // log something so we know its working
    console.log('doing name validations on ' + name);
    // once validation is done save the new item in the req
    req.name = name;
    // go to the next thing
    next();
});

// users page (http://localhost:PORT/admin/users)
adminRouter.get('/users', function(req, res){
    res.send('i show all the user');
});

// respond to request with params
adminRouter.get('/users/:name', function(req, res){
    res.send('hello '+req.params.name);
});


// posts page (http://localhost:PORT/admin/posts)
adminRouter.get('/posts', function(req, res){
    res.send('i show all the posts');
});

app.use('/admin', adminRouter);

// start the server
app.listen(PORT);
console.log('Express Server running at http://127.0.0.1:'.PORT);