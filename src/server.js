const express = require('express')
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//configurar pasta public
server.use(express.static("public"))

//habilitaar o uso do req.body na nossaa aplicaçao
server.use(express.urlencoded({ extended: true }))


//utilizando o template engine
const nunjucks = require("nunjucks") // o nunjuck vai te viabilizar poder trabalhar com o HTML
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})




//configurar caminhos da aplicaçao

//pagina inicial
server.get("/", (req, res) => {
    return res.render("index.html", { tittle: "Um titulo" }) //render faz passaer pelo nunjucks
})




server.get("/create-point", (req, res) => {

    //req.query : Query strings da nossa url
    // req.query()



    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    //req.body: O corpo do nosso formulario
    // console.log(req.body)

    //inserir dados no banco de dados

    const query = `
        INSERT INTO places(
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            
            // return res.send("Erro no cadastro")
            return res.render("create-point.html", {saved: false})
        }

        // console.log("Cadastrado com Sucesso")
        // console.log(this)

        return res.render("create-point.html", {saved: true})
    }


    db.run(query, values, afterInsertData)

    
})





server.get("/search", (req, res) => {
    const search = req.query.search

    if(search == ""){
        //Pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }




    //pegar os dados do banco de dados
    
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%' `, function(err, rows){
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        // console.log(rows)
        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total })
    })



})



//ligar o servidor
server.listen(3000)

