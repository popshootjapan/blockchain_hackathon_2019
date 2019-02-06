var Web3 = require('web3');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var twitter = require('twitter');
var twitterCli = new twitter({
    consumer_key:        'JlwTbLCyFdrdJ1Sdlk8Rv3Riq',
    consumer_secret:     'RneGGAJYcq0LZEny2tf9xMDacKqwiWjifxRMJujH46LY5EFrVg',
    access_token_key:    '555212502-bmqngOmrCIrUA9AHKvlpqWrLZM9m4NQNNiKAPNHA',
    access_token_secret: 'pFMM6BN2Z2Yjc9UbHdVmux4y7FPkpsFwrcsG5tCKs5C7l',
});

var app = express();
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

var web3 = new Web3('http://<YOUR SUBDOMAIN>.getho.io:80/jsonrpc');

const contractAddr = '<CONTRACT ADDRESS>';
const abi = [{constant:true,inputs:[{name:"",type:"address"}],name:"twitterIdentifications",outputs:[{name:"",type:"string"}],payable:false,stateMutability:"view",type:"function"},{constant:false,inputs:[{name:"twitterId",type:"string"},{name:"hash",type:"bytes32"},{name:"signature",type:"bytes"}],name:"identify",outputs:[],payable:false,stateMutability:"nonpayable",type:"function"},{constant:true,inputs:[{name:"hash",type:"bytes32"},{name:"signature",type:"bytes"}],name:"ecverify",outputs:[{name:"sig_address",type:"address"}],payable:false,stateMutability:"pure",type:"function"}];

var c = new web3.eth.Contract(abi, contractAddr);

web3.eth.getAccounts()
    .then((accounts) => {
        web3.eth.defaultAccount = accounts[0];
        console.log('set default account to ' + accounts[0]);
        app.listen(3000)
    })
    .catch(function (error){
        console.log(error);
        throw error;
    });

app.get('/', function (req, res) {
    var p = c.methods.twitterIdentifications(web3.eth.defaultAccount).call({ from: web3.eth.defaultAccount });
    p.then((r) => {
        console.log(r);
        res.render('./index.ejs', {addr: web3.eth.defaultAccount, signed: null, account: r})
    })
    .catch(function (error){
        console.log(error);
        throw error;
    });
})

app.post('/sign', function(req, res) {
    var twitterId = req.body.twitter_id;
    var hexTwitterId = web3.utils.fromAscii(twitterId);
    var padded = web3.utils.padLeft(hexTwitterId, 64);
    console.log("Sign Message: " + twitterId);
    web3.eth.personal.sign(
        padded,
        web3.eth.defaultAccount,
        "oFgX2LCy"
      )
      .then((m) => {
          res.render('./index.ejs', {addr: web3.eth.defaultAccount, signed:m, account: null})
      });
})

app.post('/verify', function(req, res) {
    var tweetUrl = req.body.tweet_url;
    console.log("Tweet URL: " + tweetUrl);
    splited = tweetUrl.split('/');
    tweetId = splited[splited.length-1];
    twitterId = splited[3];

    twitterCli.get('/statuses/show/'+tweetId, {})
    .then(function (tweet) {
        var sigBytes = web3.utils.hexToBytes(web3.utils.toHex(tweet.text));
        var paddedTwitterIdBytes32 = web3.utils.hexToBytes(web3.utils.padLeft(web3.utils.fromAscii(twitterId), 64));
        var p = c.methods.identify(twitterId, paddedTwitterIdBytes32, sigBytes).send({ from: web3.eth.defaultAccount });
        p.then((r) => {
            console.log(r);
            res.redirect(302, '/');
        })
        .catch(function (error){
            console.log(error);
            throw error;
        });
      })
      .catch(function (error) {
          console.log(error);
        throw error;
      })
})