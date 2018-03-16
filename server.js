// server.js

var express  = require('express');
var app      = express();                               
var mongoose = require('mongoose');                     
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override'); 


mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/todo');     

app.use(express.static(__dirname + '/public'));                
app.use(morgan('dev'));                                        
app.use(bodyParser.urlencoded({'extended':'true'}));           
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());

const port = process.env.PORT || 3000;

var Todo = mongoose.model('Todo', {
    text : String,
    date: String
});


app.get('/api/todos', (req, res) =>{

    Todo.find((err, todos)=> {

        if (err)
            res.send(err)

        res.json(todos); 
    });
});

app.post('/api/todos', (req, res) => {
    if(req.body.date)
        var date = new Date(req.body.date);
    else
        var date = "";
    console.log(date);
    if(req.body.text){
        Todo.create({
            text : req.body.text,
            date: date,
            done : false
        }, (err, todo) =>{
            if (err)
                res.send(err);

            Todo.find((err, todos) => {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    }

});

// app.finish('/api/todos/:todo_id', (req,res) =>{
//     Todo.remove({
//         _id: req.params.todo_id
//     }, (err, todo) =>{
//         if(err)
//             res.send(err);
//         Todo.find((err,todos)=>{
//             if(err)
//                 res.send(err);
//             res.json(todos);
//         })
//     })
// })

app.delete('/api/todos/:todo_id', (req, res) =>{
    Todo.remove({
        _id : req.params.todo_id
    }, (err, todo) =>{
        if (err)
            res.send(err);

        Todo.find((err, todos)=> {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.get('*', (req, res) =>{
    res.sendfile('./public/index.html'); 
});

app.listen(port);
console.log(`App listening on port ${port}`);