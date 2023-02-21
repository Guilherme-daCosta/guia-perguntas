const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");


// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o Banco de dados");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });


// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Rotas
app.get("/", (req, res) => {
    
    res.render("index.ejs")
    
});


app.get("/perguntar", (req, res) => {

    res.render("perguntar");

});


app.post("/salvarpergunta", (req, res) => {

    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });

});


app.listen(8080, () => {
    console.log("App rodando!");
});