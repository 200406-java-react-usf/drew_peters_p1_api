import express from 'express';

let app = express();

app.use('/', express.json());

app.get('/', (req,resp) => {

    resp.send('OH, WOWWIE!');

});

app.listen(8080);