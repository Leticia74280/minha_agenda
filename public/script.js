const form = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const idInput = document.getElementById('userId');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');
const themeToggle = document.getElementById('themeToggle');

// Modo noturno
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    themeToggle.title = theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro';
}

// 1. Enviar Formulário (Decide entre Criar ou Editar)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = idInput.value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const data = { name, phone, email };

    try {
        let response;
        if (id) {
            // Se tem ID, é EDIÇÃO (PUT)
            response = await fetch(`/api/contacts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Se não tem ID, é NOVO (POST)
            response = await fetch('/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();
        if(result.message === "success") {
            resetForm();
            loadContacts();
        }
    } catch (error) { console.error(error); }
});

// 2. Preencher formulário para editar
window.startEdit = (id, name, phone, email) => {
    idInput.value = id;
    document.getElementById('name').value = name;
    document.getElementById('phone').value = phone;
    document.getElementById('email').value = email;

    btnSave.textContent = "Atualizar Contato";
    btnSave.style.backgroundColor = "#e0a800"; // Amarelo
    btnCancel.style.display = "block"; // Mostra botão cancelar
    window.scrollTo(0, 0); // Sobe a tela
}

// 3. Excluir Contato
window.deleteContact = async (id) => {
    if(confirm('Tem certeza que deseja excluir?')) {
        await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
        loadContacts();
    }
}

// 4. Limpar Formulário
window.resetForm = () => {
    form.reset();
    idInput.value = '';
    btnSave.textContent = "Salvar Contato";
    btnSave.style.backgroundColor = "#28a745"; // Verde
    btnCancel.style.display = "none";
}

// 5. Carregar Lista
async function loadContacts() {
    const response = await fetch('/api/contacts');
    const result = await response.json();
    contactList.innerHTML = '';

    result.data.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="info">
                <strong>${c.name}</strong>
                <span>📞 ${c.phone}</span>
                <span>✉️ ${c.email}</span>
            </div>
            <div class="actions">
                <button class="btn-edit" onclick="startEdit('${c.id}', '${c.name}', '${c.phone}', '${c.email}')">Editar</button>
                <button class="btn-delete" onclick="deleteContact('${c.id}')">Excluir</button>
            </div>
        `;
        contactList.appendChild(li);
    });
}

function updateStats(total, filtered) {
    document.getElementById('totalContacts').textContent = total;
    document.getElementById('filteredContacts').textContent = filtered;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

loadContacts();
