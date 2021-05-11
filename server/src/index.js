const express = require('express');
const morgan = require('morgan')
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const hanzi = require('hanzi')
const middlewares = require('./middlewares')

app.use(morgan('common'));
app.use(helmet())
app.use(cors({
    origin: 'http://localhost:3000'
}));
hanzi.start();

app.get('/',(req,res)=>{
    res.send(hanzi.definitionLookup('爱'))
});




app.use(middlewares.notFound);
app.use(middlewares.errHandler);


const port = process.env.PORT || 1337;
app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})