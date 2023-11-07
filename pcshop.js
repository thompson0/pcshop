const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/server', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UsuarioSchema = new mongoose.Schema({
    senha: { type: String, require: true},
    email: { type: String, required: true}
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

const produtotecnologiaSchema = new mongoose.Schema({
    id_produtotecnologia: { type: String, required: true },
    descricao: { type: String },
    Marca: { type: String },
    DataFabricacao: { type: Date },
    QtEstoque: { type: Number },
});

const Produtotecnologia = mongoose.model("Produtotecnologia", produtotecnologiaSchema);

 
    app.post("/cadastroUsuario", async(req, res)=>{
        const senha = req.body.senha;
        const email = req.body.email;

    const novoUsuario = new Usuario({ 
        senha:senha,
        email:email
    });
    if (!senha || !email) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const emailExistente = await Usuario.findOne({ email: email });

    if (emailExistente) {
        return res.status(400).json({ error: "O email cadastrado já existe" });
    }

    try {
        const usuarioSalvo = await novoUsuario.save();
        res.json({ error: null, msg: "Cadastro de usuário realizado com sucesso", UsuarioId: usuarioSalvo._id });
    } catch (error) {
        res.status(400).json({ error });
    }
});

app.post("/cadastroProduto", async (req, res) => {
    const { id_produtotecnologia, descricao, Marca, DataFabricacao, QtEstoque } = req.body;

    const novoProduto = new Produtotecnologia({
        id_produtotecnologia,
        descricao,
        Marca,
        DataFabricacao,
        QtEstoque,
    });
    
    if (!id_produtotecnologia || !descricao || !Marca || !DataFabricacao || QtEstoque == null) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    if (QtEstoque > 41) {
        return res.status(400).json({ error: "Limite de estoque foi superado. Impossível cadastrar." });
    } else if (QtEstoque <= 0) {
        return res.status(400).json({ error: "Digite um valor positivo menor ou igual a 41" });
    }
    try {
        const produtoSalvo = await novoProduto.save();
        res.json({ error: null, msg: "Cadastro de produto realizado com sucesso", ProdutoId: produtoSalvo._id });
    } catch (error) {
        res.status(400).json({ error });
    }

});

app.get("/cadastroUsuario", async (req, res) => {
    res.sendFile(__dirname + "/cadastroUsuario.html");
});

app.get("/cadastroProduto", async (req, res) => {
    res.sendFile(__dirname + "/cadastroProduto.html");
});

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
