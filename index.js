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
app.get("/", (req, res) => { // Realizando SELECT das perguntas no MySQL

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


app.get("/perguntar", (req, res) => { // Página perguntar

    res.render("perguntar");

});



app.post("/salvarpergunta", (req, res) => { // Realizando o INSERT das perguntas no Banco de Dados MySQL

    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });

});


app.get("/pergunta/:id", (req, res) => { // Realizando SELECT com WHERE no MySQL

    let id = req.params.id;

    Pergunta.findOne({ 
        where: { id: id } 
    }).then(pergunta => {

            if (pergunta != undefined) { // Pergunta encontrada

                Resposta.findAll({ // Procurando respostas e ordenando no MySQL
                    where: {perguntaId: pergunta.id},
                    order: [ ['id', 'DESC'] ]
                }).then(respostas => {
                    res.render("pergunta.ejs", {
                        pergunta: pergunta,
                        respostas: respostas
                    });
                });                
            } else { // Não encontrada
                res.redirect("/");
            }
        })
});


app.post("/responder", (req, res) => { // Realizando INSERT das respostas no MySQL

    let perguntaId = req.body.pergunta;
    let corpo = req.body.corpo

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });

})


app.listen(8080, () => {
    console.log("App rodando!");
});