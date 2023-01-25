const express = require('express');
const app = express();
var cors = require('cors');
const port = 3001;

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