var Web3 = require('web3');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

var web3 = new Web3('http://sassy-shark-77728.getho.io:80/jsonrpc');

const todoAddr = '<TODO_CONTRACT_ADDRESS>';
const abi = [];

var todoContract = new web3.eth.Contract(abi, todoAddr);

web3.eth.getAccounts()
    .then((accounts) => {
        web3.eth.defaultAccount = accounts[0];
        console.log('set default account to ' + accounts[0]);
        app.listen(3000)
    }
);

app.get('/', function (req, res) {
    res.send('Hello World')
})