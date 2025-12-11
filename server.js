const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com Banco de Dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    console.log('Conectado ao banco de dados SQLite.');
});

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT
)`);

// [GET] Listar Contatos
app.get('/api/contacts', (req, res) => {
    db.all("SELECT * FROM contacts ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// [POST] Criar Contato
app.post('/api/contacts', (req, res) => {
    const { name, phone, email } = req.body;
    const sql = "INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)";
    db.run(sql, [name, phone, email], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: { id: this.lastID, name, phone, email } });
    });
});

// [PUT] Editar Contato
app.put('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    const { name, phone, email } = req.body;
    const sql = "UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?";
    db.run(sql, [name, phone, email, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: { id, name, phone, email } });
    });
});

// [DELETE] Excluir Contato (Bônus extra)
app.delete('/api/contacts/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM contacts WHERE id = ?", id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success" });
    });
});

app.listen(PORT, () => {
    console.log(`Agenda rodando em http://localhost:${PORT}`);
});