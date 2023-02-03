const express = require('express');
const app = express();
const path = require('path');
var cors = require('cors');


// Every time frontend tries to serve this (backend), it will automatically be stored in public folder.
// app.use(express.static(path.join(__dirname + "/public")));

// For later setting environment variables, else we use 3001 as default port.
const port = process.env.PORT || 3001;

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    console.log("Req found");
    res.json({info:'Hello World'} || {});
});

app.listen(port, () => {
    console.log(`Example Express app listening at http://localhost:${port}`)
});