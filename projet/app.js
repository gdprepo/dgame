const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const redis = require('redis');

// Load env vars
dotenv.config({ path: './config/config.env' });

// mongoose.connect(
//   `mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@ds241658.mlab.com:41658/test_db`,
//   (err) => {
//     if (err) throw err;
//     console.log("DB Connected Successfully");
//   }
// );

// Connect DB
connectDB();

const app = express();



// Init Middleware
app.use(express.json({ extended: false }));

app.set('view engine', 'ejs');



app.get('/', (req, res) => {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);



	if (req.header('Accept').includes('application/json')) {
		res.status(406).json({ msg: 'NOT_API_AVAILABLE' });
	} else {
		res.redirect('games');
	}
});

// Define Routes
app.use("/", require("./router"));

const PORT = process.env.PORT || 5000;
// const REDIS_PORT = process.env.PORT || 6379;

// const client = redis.createClient(REDIS_PORT)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
