const express = require('express');
const userRoutes = require('./routes/users'); // import the routes
const postRoutes = require('./routes/posts'); // import the routes
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors())
app.use('/', userRoutes); //to use the routes
app.use('/', postRoutes); //to use the routes

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})