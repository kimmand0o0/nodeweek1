const express = require('express');
const app = express();

require('dotenv').config()
const port = process.env.PORT

const cors = require('cors')
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require('mongoose')
mongoose.connect(process.env.URI).then(() => console.log("MongoDB Connected"))
  .catch(error => console.error(error))

app.set('port', port );

app.get('/', (req, res) => {
    res.send('안녕하세요, 항해99 10기 E반 김혜란 입니다.')
  })

app.use('/api', require('./routes/posts'))
app.use('/api', require('./routes/comments'))

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});