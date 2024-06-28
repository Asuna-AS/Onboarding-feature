const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/routes');
const cors = require('cors')

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/schoolDB');

app.use(cors())
app.use('/api/users', userRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
  