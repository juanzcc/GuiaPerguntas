const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Respostas");

//database
connection.authenticate().then(() =>{
    console.log("Conexão feita com o BD");
})
    .catch((msgErro) => {
        console.log(msgErro);
    })

// Falando pro Express usar EJS como vie Engine
app.set('view engine', 'ejs'); 
app.use(express.static('public'));

// permite que as pessoas enviem os dados para que consiga usar no projeto
app.use(bodyParser.urlencoded({extended: true})) 
// comando para ler dados de formulario via json - para API
app.use(bodyParser.json());

//rotas
app.get("/", (req, res) => {
    //Buscando tds info no BD
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC'] //ordenando pelo ultimo ID
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    })
    //metodo render, olha na pasta views direto
    
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({ //inserindo no BD
        titulo: titulo,
        descricao: descricao
    }).then(() => { //Quando for inserido no bd, o usuario é mandado a pagina inicial
        res.redirect("/");
    })

})

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //achou o id e a pergunta
            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                })     
            });
        }else{ //não achou a pergunta
            res.redirect("/");
        }
    })
})

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/" + perguntaId);
    })
})

//Porta que vai ser usada no site
app.listen(3000,() =>{
    console.log("App rodando!");
});