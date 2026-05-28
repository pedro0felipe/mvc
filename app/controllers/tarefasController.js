const tarefasModel = require("../models/tarefasModel");
const moment = require("moment");
const { body, validationResult } = require("express-validator");

const tarefasController = {

    regrasValidacao:[
        body("tarefa").isLength({ min: 5, max: 45 }).withMessage("A tarefa deve conter entre 5 e 45 caracteres!"),
        body("prazo").isISO8601().withMessage("O prazo deve ser uma data válida!"),
        body("situacao").isNumeric().withMessage("A situação deve ser um número!")
    ],

    iniciarTarefa: async (req, res) => {
        let { id } = req.query;
        try {
            results = await tarefasModel.situacaoTarefa(1, id);
        } catch (e) {
            console.log(e);
            res.json({ erro: "Erro ao iniciar tarefa!" });
        }
        let url= req.rawHeader[25];
        let urlChamadora = url.replace("http://localhost:3000/", "");
        res.redirect(urlChamadora);
    }
};

module.exports = tarefasController;