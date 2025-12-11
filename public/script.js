const form = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const idInput = document.getElementById('userId');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');
const searchInput = document.getElementById('searchInput');

let allContacts = [];

//busca
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterContacts(searchTerm);
});

function filterContacts(searchTerm) {
    if (!searchTerm) {
        renderContacts(allContacts);
        return;
    }

    const filtered = allContacts.filter(contact => {
        return contact.name.toLowerCase().includes(searchTerm) ||
               contact.phone.toLowerCase().includes(searchTerm) ||
               contact.email.toLowerCase().includes(searchTerm);
    });

    renderContacts(filtered);
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
    try {
        const response = await fetch('/api/contacts');
        const result = await response.json();
        allContacts = result.data;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filterContacts(searchTerm);
        } else {
            renderContacts(allContacts);
        }
        
        updateStats(allContacts.length, contactList.children.length);
    } catch (error) {
        console.error(error);
        contactList.innerHTML = '<li class="no-results">❌ Erro ao carregar contatos</li>';
    }
}

function renderContacts(contacts) {
    contactList.innerHTML = '';

    if (contacts.length === 0) {
        const searchTerm = searchInput.value.trim();
        const message = searchTerm 
            ? `Nenhum contato encontrado para "${searchTerm}"` 
            : 'Nenhum contato cadastrado ainda';
        contactList.innerHTML = `<li class="no-results">📭 ${message}</li>`;
        updateStats(allContacts.length, 0);
        return;
    }

    contacts.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="info">
                <strong>${escapeHtml(c.name)}</strong>
                <span>📞 ${escapeHtml(c.phone)}</span>
                <span>✉️ ${escapeHtml(c.email)}</span>
            </div>
            <div class="actions">
                <button class="btn-edit" onclick="startEdit('${c.id}', '${escapeHtml(c.name)}', '${escapeHtml(c.phone)}', '${escapeHtml(c.email)}')">Editar</button>
                <button class="btn-delete" onclick="deleteContact('${c.id}')">Excluir</button>
            </div>
        `;
        contactList.appendChild(li);
    });

    updateStats(allContacts.length, contacts.length);
}

loadContacts();
