var express = require("express");
var router = express.Router();
const { tarefasModel } = require("../models/tarefasModel"); //usar sempre o {}
const { body, validationResult } = require('express-validator');
const moment = require("moment");
moment.locale('pt-br');

router.get("/", async function (req, res) {
    res.locals.moment = moment;
    try {
        const result = await tarefasModel.findAll();
        console.log(result)
        res.render("pages/index", { listaTarefas: result })
    } catch (erro) {
        console.log(erro);
    }
});


router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro",
        {
            tituloPagina: "Cadastro de Tarefas", tituloAba: "Cadastro",
            tarefa: {
                id_tarefa: 0, nome_tarefa: "",
                prazo_tarefa: "", situacao_tarefa: 1
            }
        });
});

router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    const id = req.query.id;
    try {
        const result = await tarefasModel.findById(id);
        if (result.length > 0) {
            res.render("pages/cadastro", {
                tituloPagina: "Editar Tarefa",
                tituloAba: "Editar",
                tarefa: result[0]
            });
        } else {
            res.redirect("/");
        }
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.post("/manter-tarefa", 
    [
        body('nome').notEmpty().withMessage('Nome é obrigatório').isLength({ min: 3, max: 45 }).withMessage('Nome deve ter entre 3 e 45 caracteres'),
        body('prazo').isDate().withMessage('Prazo deve ser uma data válida'),
        body('situacao').isInt({ min: 0, max: 4 }).withMessage('Situação deve ser um número entre 0 e 4')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.locals.moment = moment;
            return res.render("pages/cadastro", {
                tituloPagina: req.body.id == 0 ? "Cadastro de Tarefas" : "Editar Tarefa",
                tituloAba: req.body.id == 0 ? "Cadastro" : "Editar",
                tarefa: req.body,
                errors: errors.array()
            });
        }

        const objDados = {
            id : req.body.id,
            nome: req.body.nome,
            prazo: req.body.prazo,
            situacao: req.body.situacao
        }

        try {
            if(objDados.id == 0){
                const result = await tarefasModel.create(objDados);  
            }else{
                const result = await tarefasModel.update(objDados);  
            }
            
            res.redirect("/");
        } catch (erro) {
            console.log(erro);
            res.redirect("/");
        }
    }
)


router.get("/delete-fisico/:id", async (req, res) => {
    try {
        await tarefasModel.deleteFisico(req.params.id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

router.get("/delete-logico/:id", async (req, res) => {
    try {
        await tarefasModel.deleteLogico(req.params.id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
        res.redirect("/");
    }
});

module.exports = router;