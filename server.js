const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'database.db');

// Conexão com Banco de Dados
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ Erro ao conectar no banco:', err.message);
        process.exit(1); // Encerra se não conseguir conectar
    }
    console.log('✅ Conectado ao banco de dados SQLite.');
});

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    email TEXT
)`, (err) => {
    if (err) {
        console.error('❌ Erro ao criar tabela:', err.message);
    } else {
        console.log('✅ Tabela contacts verificada/criada.');
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Agenda rodando em http://0.0.0.0:${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`💾 Banco de dados: ${dbPath}`);
});
