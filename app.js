const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./connection')
const indexRouter = require('./routes/index');
const tradesRouter = require('./routes/trades');

const app = express();
app.use(express.json());
const port = 8080;

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var Trade = require("./models/trades");

app.get("/", (req, res)=>{
    res.send("Running");
})

app.use('/trades', tradesRouter);
app.use('/', indexRouter);

app.post("/trades", async (req, res)=>{
    try{
        const trade = await Trade.create(req.body);
        res.status(201).send(trade);
    }
    catch{
        res.status(404).send("An error occured!");
    }
    
})

app.get("/trades", async (req, res)=>{
    try{
        var findUser = await Trade.findAll();
        res.status(200).send(findUser);
    }
    catch{
        res.status(404).send("Something went wrong!");
    }
})

app.get("/trades/:id", async (req, res)=>{
    try{
        var id = req.params.id;
        var findUser = await Trade.findOne({id: id})
        res.status(200).send(findUser);
    }
    catch{
        res.status(404).send("Something went wrong!");
    }
})

app.put("/trades/:id", async (req, res)=>{
    try{
        var id = req.params.id;
        var updateTrade = await Trade.update({
            type: req.body.type,
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            shares: req.body.shares, 
            price: req.body.price,
            timestamp: req.body.timestamp
        }, {
            where: {
                id: id
            }
        });

        res.status(200).send(updateTrade);
    }
    catch{
        res.status(404).send("Something went wrong!");
    }
})

app.patch("/trades/:id", async(req, res)=>{
    try{
        var id = req.params.id;
        var updateTrade = await Trade.update(req.body, {
            where: {
                id: id
            },
            individualHooks: true
        });

        res.status(200).send(updateTrade);
    }
    catch{
        res.status(404).send("An Error occured!");
    }
})

app.delete("/trades/:id", async(req, res)=>{
    try{
        var id = req.params.id;
        await Trade.destroy(
            {
                where: {id: id}
            },
        );
        res.status(200).send("Deleted!");
    }
    catch{
        res.status(404).send("An Error occured!");
    }
})



module.exports = app;



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
