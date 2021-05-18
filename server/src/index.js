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
//app.use(bodyParser.urlencoded({ extended: false }));

hanzi.start();

app.get('/',(req,res)=>{
    res.json(hanzi.definitionLookup('爱'))
});

app.get('/word',(req,res)=>{
    if(!req.query.char){
        res.send("Error: No character selected");
    }
    const char = req.query.char;
    res.json(hanzi.definitionLookup(char));
});



app.use(middlewares.notFound);
app.use(middlewares.errHandler);


const port = process.env.PORT || 1337;
app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})