const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
require('dotenv/config');


app.use(cors());
app.options('*', cors());

const api = process.env.API_URL;



//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);   
app.use('/public/upload', express.static(__dirname + '/public/upload'));

//routers
const productRouter = require('./routers/product_router');
const categoriesRouter = require('./routers/categories_router');
const usersRouter = require('./routers/users_router');
const ordersRouter = require('./routers/orders_router');
const authorsRouter = require('./routers/authors_router');

app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/authors`, authorsRouter);


mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database connection is ready');
})
.catch((err) => {
    console.log(err);
})

app.listen(3000, () => {
    console.log('server is running http://localhost:3000');
})