const axios = require('axios');
const express = require('express');
const app = express();

const air = require('./air');
app.use('/air',air);

app.listen(8080, function () {
    console.log('listening on 8080');
});

