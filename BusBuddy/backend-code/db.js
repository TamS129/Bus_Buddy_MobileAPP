const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '/.env' }); // Contains db credentials

const app = express();
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const ALLOWED_TABLES = ['test_table','stops','trips','shapes','routes','calendar','calendar_dates','stop_times','favorites'];

function validateTable(req, res, next) {
    const { table } = req.params;
    console.log(table);
    if (!ALLOWED_TABLES.includes(table)) {
        return res.status(400).json({ error: 'Invalid Table Name' });
    }
    next();
}

app.use('/api/:table', validateTable);

// CREATE
app.post('/api/:table', async (req, res) => {
    const { table } = req.params;
    const columns = Object.keys(req.body);
    const placeholders = columns.map(() => '?').join(',');
    const sql = `INSERT INTO \`${table}\` (${columns.join(',')}) VALUES (${placeholders})`;

    try {
        const [result] = await pool.execute(sql, Object.values(req.body));
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ ALL
app.get('/api/:table', async (req, res) => {
    const { table } = req.params;
    const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
    res.json(rows);
});

// READ ONE
app.get('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const [rows] = await pool.execute(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);
    rows.length ? res.json(rows[0]) : res.sendStatus(404);
});

// UPDATE
app.put('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const columns = Object.keys(req.body);
    const assignments = columns.map(col => `\`${col}\` = ?`).join(',');
    const sql = `UPDATE \`${table}\` SET ${assignments} WHERE id = ?`;

    const [result] = await pool.execute(sql, [...Object.values(req.body), id]);
    res.sendStatus(result.affectedRows ? 204 : 404);
});

// DELETE
app.delete('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const [result] = await pool.execute(`DELETE FROM \`${table}\` WHERE id = ?`, [id]);
    res.sendStatus(result.affectedRows ? 204 : 404);
});

//CUSTOM QUERY
app.post('/api/:table/query', async (req, res) => {
    const { query } = req.body;
    const { table } = req.params;

    // Reject non-SELECT queries (basic check)
    if (!query.includes("SELECT")) {
        return res.status(400).json({ error: 'Only SELECT queries are allowed' });
    }
    console.log(query);
    try {
        const [rows] = await pool.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.listen(2501, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
