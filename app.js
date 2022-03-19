const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const crudRoutes = require('./routes/crudRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
//const { checkUser } = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'templates');

app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(crudRoutes);
app.use(dashboardRoutes);

app.use(express.static(__dirname + '/static/'));

const dbURL = 'mongodb://user:cluster@cluster0-shard-00-00.vwxtz.mongodb.net:27017,cluster0-shard-00-01.vwxtz.mongodb.net:27017,cluster0-shard-00-02.vwxtz.mongodb.net:27017/lms?ssl=true&replicaSet=atlas-uljynf-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port);    
  })
  .catch((err) => console.log(err));

//app.get('*', checkUser);

app.use((req, res) => {
    res.status(400).render('404');
});
