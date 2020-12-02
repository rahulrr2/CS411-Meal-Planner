const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'hema75',
    database: 'testing_schema',

})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))



app.get("/api/select", (req,res) => {

    const sqlQuery = req.query.sqlQuery;
    
    db.query(sqlQuery, (err,result) => {
        console.log(result)
        console.log(err)
        if(err){
            res.send({status: 'error', msg: err})
        }else{
            res.send({status: 'success', msg: result})
        }
    })
});

app.post("/api/insert", (req,res) => {

    const sqlQuery = req.body.sqlQuery;
    
    db.query(sqlQuery, (err,result) => {
        console.log(result)
        console.log(err)
        if(err){
            res.send({status: 'error', msg: err})
        }else{
            res.send({status: 'success', msg: result})
        }
    })
});

app.post("/api/update", (req,res) => {

    const sqlQuery = req.body.sqlQuery;
    
    db.query(sqlQuery, (err,result) => {
        console.log(result)
        if(err){
            res.send({status: 'error', msg: err})
        }else{
            res.send({status: 'success', msg: result})
        }
    })
});

app.post("/api/delete", (req,res) => {

    const sqlQuery = req.body.sqlQuery;
    
    db.query(sqlQuery, (err,result) => {
        console.log(result)
        if(err){
            res.send({status: 'error', msg: err})
        }else{
            res.send({status: 'success', msg: result})
        }
    })
});



app.listen(3001, () => {
    console.log("Running express server on port 3001")
});