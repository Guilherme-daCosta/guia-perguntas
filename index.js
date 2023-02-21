const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");


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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Rotas
app.get("/", (req, res) => {

    // Realizando SELECT das perguntas no MySQL
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC'] // Realizando ORDER BY -- ASC = Crescente || DESC = Decrescente
        ]
    }).then(perguntas => {
        res.render("index.ejs", {
            perguntas: perguntas
        });
    });
});


app.get("/perguntar", (req, res) => {

    res.render("perguntar");

});


app.post("/salvarpergunta", (req, res) => {

    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    // Realizando o INSERT das perguntas no Banco de Dados MySQL
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });

});


app.get("/pergunta/:id", (req, res) => {

    let id = req.params.id;

    // Realizando SELECT com WHERE no MySQL
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {

        if (pergunta != undefined) { // Pergunta encontrada
            res.render("pergunta.ejs", {
                pergunta: pergunta
            });
        } else { // Não encontrada
            res.redirect("/");
        }

    })

});


app.listen(8080, () => {
    console.log("App rodando!");
});