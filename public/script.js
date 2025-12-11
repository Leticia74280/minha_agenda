const form = document.getElementById('contactForm');
const contactList = document.getElementById('contactList');
const idInput = document.getElementById('userId');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');

let allContacts = [];

//modo noturno
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
        
        // Criar elementos de forma segura
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
        
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = c.name;
        
        const phoneSpan = document.createElement('span');
        phoneSpan.textContent = `📞 ${c.phone}`;
        
        const emailSpan = document.createElement('span');
        emailSpan.textContent = `✉️ ${c.email}`;
        
        infoDiv.appendChild(nameStrong);
        infoDiv.appendChild(phoneSpan);
        infoDiv.appendChild(emailSpan);
        
        // Criar botões de ação
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions';
        
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-edit';
        btnEdit.textContent = 'Editar';
        btnEdit.onclick = () => startEdit(c.id, c.name, c.phone, c.email);
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.textContent = 'Excluir';
        btnDelete.onclick = () => deleteContact(c.id);
        
        actionsDiv.appendChild(btnEdit);
        actionsDiv.appendChild(btnDelete);
        
        li.appendChild(infoDiv);
        li.appendChild(actionsDiv);
        contactList.appendChild(li);
    });

    updateStats(allContacts.length, contacts.length);
}

function updateStats(total, filtered) {
    document.getElementById('totalContacts').textContent = total;
    document.getElementById('filteredContacts').textContent = filtered;
}

loadContacts();
