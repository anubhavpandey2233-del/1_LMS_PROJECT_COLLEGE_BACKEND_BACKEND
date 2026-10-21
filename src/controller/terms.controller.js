const fs = require('fs');
const pool = require('../db/mysql');

const addTerms = async (req, res) => {
    // #swagger.tags = ['terms']
    try {
        const{name, description} = req.body
        const [rows] = await pool.query("INSERT INTO terms(name, description) VALUES (? , ? )", [name, description])

        const [result] = await pool.query(`SELECT * FROM terms WHERE id=${rows.insertId}`)

        if (!rows) {
            res.status(404).json({
                success: flase,
                data: null,
                message: "Data not add successfully."
            })
        }

        res.status(200).json({
            success: true,
            data: result[0],
            message: "Data add successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server erorr " + error
        })
    }
}

const getAllTerms = async (req, res) => {
    // #swagger.tags = ['terms']
    try {
        const [rows] = await pool.query("SELECT * FROM terms")

        console.log(rows);

        if (!rows) {
            res.status(404).json({
                success: flase,
                data: null,
                message: "All Data not found."
            })
        }

        res.status(200).json({
            success: true,
            data: rows,
            message: "All Terms Data Feached."
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server erorr" + error
        })
    }
}

const getTerms = async (req, res) => {
    // #swagger.tags = ['terms']
    try {
        const [rows] = await pool.query(`SELECT * FROM terms WHERE id=${req.params.id}`)

        console.log(rows);

        if (!rows) {
            res.status(404).json({
                success: flase,
                data: null,
                message: "Data not found."
            })
        }

        res.status(200).json({
            success: true,
            data: rows,
            message: "Data feached."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server erorr" + error
        })
    }
}

const updateTerms = async (req, res) => {
    // #swagger.tags = ['terms']
    try {
        const{name, description} = req.body;
        const termsId = req.params.id

        const [rows] = await pool.query(
            `UPDATE terms SET name=?, description=? WHERE id=${termsId}`,
            [name, description]        
        )

        

        if (!rows) {
            res.status(404).json({
                success: flase,
                data: null,
                message: "Data not updeated successfully."
            })
        }

        res.status(200).json({
            success: true,
            data: {name, description, termsId},
            message: "Data updeated successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server erorr" + error
        })
    }
}

const deletTerms = async (req, res) => {
    // #swagger.tags = ['terms']
    try {
        const [rows] = await pool.query(`DELETE FROM terms WHERE id=${req.params.id}`)

        if (!rows) {
            res.status(404).json({
                success: flase,
                data: null,
                message: "Data not delete successfully."
            })
        }

        res.status(200).json({
            success: true,
            data: null,
            message: "Data delete successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server erorr" + error
        })
    }
}

module.exports = {
    addTerms,
    getAllTerms,
    getTerms,
    updateTerms,
    deletTerms,
}