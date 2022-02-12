const express = require('express');
const morgan = require('morgan')
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const hanzi = require('hanzi')
const middlewares = require('./middlewares')

app.use(morgan('common'));
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
);
app.use(cors({
    origin: 'http://localhost:3000'
}));
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/build')));

hanzi.start();

app.get('/',(req,res)=>{
    res.json(hanzi.definitionLookup('爱'))
});

app.get('/word',(req,res)=>{
    if(!req.query.char){
        res.send("Error: No character selected");
    }
    const char = req.query.char;
    let chardef = hanzi.definitionLookup(char);
    if(typeof chardef == 'undefined'){
        let errorReturn = [
            {
                "error": "T",
                "traditional": "NULL",
                "simplified": "NULL",
                "pinyin": "NULL",
                "definition": "NULL"
            }
        ]
        res.json(errorReturn)
    }
    res.json(chardef);
});



app.use(middlewares.notFound);
app.use(middlewares.errHandler);


const port = process.env.PORT || 1337;
app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})