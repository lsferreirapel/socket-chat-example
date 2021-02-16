const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

// Services and routes
const socketio = require('./services/socketio');
const routes = require('./routes/routes');

const app = express();
const server = http.createServer(app);

// Start socketio
socketio(server);

// Express configs
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('views', './public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routes
app.use(routes);

// Start server
server.listen(3000, () => console.log('🔥 Server linstening on port:3000'));