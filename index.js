const express = require('express')
const app = express()

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
var results = "";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  //insert sample
  var dbo = db.db("mydb");
  var myobj = [
    { name: 'John', address: 'Highway 71', account_type: 'Savings', balance: 1000},
    { name: 'Peter', address: 'Lowstreet 4', account_type: 'Savings', balance: 1000},
    { name: 'Amy', address: 'Apple st 652', account_type: 'Savings', balance: 1000},
    { name: 'Hannah', address: 'Mountain 21', account_type: 'Savings', balance: 1000},
    { name: 'Michael', address: 'Valley 345', account_type: 'Savings', balance: 1000},
    { name: 'Sandy', address: 'Ocean blvd 2', account_type: 'Savings', balance: 1000},
    { name: 'Betty', address: 'Green Grass 1', account_type: 'Savings', balance: 1000},
    { name: 'Richard', address: 'Sky st 331', account_type: 'Savings', balance: 1000},
    { name: 'Susan', address: 'One way 98', account_type: 'Savings', balance: 1000},
    { name: 'Vicky', address: 'Yellow Garden 2', account_type: 'Savings', balance: 1000},
    { name: 'Ben', address: 'Park Lane 38', account_type: 'Savings', balance: 1000},
    { name: 'William', address: 'Central st 954', account_type: 'Savings', balance: 1000},
    { name: 'Chuck', address: 'Main Road 989', account_type: 'Savings', balance: 1000},
    { name: 'Viola', address: 'Sideway 1633', account_type: 'Savings', balance: 1000}
  ];
/*  dbo.collection("customers").insertMany(myobj, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });*/
  var dbo = db.db("mydb");
  dbo.collection('customers').find({},{projection:{name: true, _id: false}}).toArray(function(err, result) {
    if (err) throw err;
    results = result;
    db.close();
  });
});

//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)

io.on('connection', (socket) => {
	console.log('New user connected')
	
	socket.emit('new_message', {message : JSON.stringify(results), username : "Admin"});
	
	//default username
	socket.username = "Anonymous"

	//listen on change_username
    	socket.on('change_username', (data) => {
        	socket.username = data.username
    	})

	//listen on new_message
    	socket.on('new_message', (data) => {
        	//broadcast the new message
        	io.sockets.emit('new_message', {message : data.message, username : socket.username});
    	})

    	//listen on typing
    	socket.on('typing', (data) => {
    		socket.broadcast.emit('typing', {username : socket.username})
   	})
})
