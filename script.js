let notes = JSON.parse(localStorage.getItem('notes')) || [];

const noteForm = document.getElementById('noteForm');
const noteTitleInput = document.getElementById('noteTitle');
const noteTagInput = document.getElementById('noteTag');
const notesContainer = document.getElementById('notes');
const searchInput = document.querySelector('.search-bar input');
const tagsList = document.getElementById('tagsList');

let activeTag = 'Все';

const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.querySelector('.close');

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = noteTitleInput.value.trim();
    const tagInput = noteTagInput.value.trim();

    if (!title || !tagInput) return;

    const tag = tagInput.charAt(0).toUpperCase() + tagInput.slice(1).toLowerCase();
    const date = new Date().toLocaleDateString('ru-RU');

    const newNote = {
        id: Date.now(),
        title,
        tag,
        date
    };

    notes.push(newNote);
    saveAndRender();
    noteForm.reset();
    modal.style.display = 'none'; 
});

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveAndRender();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
    notesContainer.innerHTML = '';

    const filtered = notes.filter(note => {
        const noteTag = note.tag.trim().toLowerCase();
        const selectedTag = activeTag.trim().toLowerCase();
        const matchesTag = selectedTag === 'все' || noteTag === selectedTag;

        const matchesSearch = note.title.toLowerCase().includes(searchInput.value.toLowerCase());

        return matchesTag && matchesSearch;
    });

    if (filtered.length === 0) {
        notesContainer.innerHTML = '<p>Нет заметок</p>';
        return;
    }

    filtered.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.date}</p>
            <span class="tag">${note.tag}</span>
            <button class="delete-btn" style="margin-left: 10px; color: red; border: none; background: none; cursor: pointer;">🗑️</button>
        `;
        noteDiv.querySelector('.delete-btn').addEventListener('click', () => deleteNote(note.id));
        notesContainer.appendChild(noteDiv);
    });
}

searchInput.addEventListener('input', renderNotes);

tagsList.querySelectorAll('li').forEach(tagEl => {
    tagEl.addEventListener('click', () => {
        activeTag = tagEl.textContent;
        tagsList.querySelectorAll('li').forEach(t => t.classList.remove('active'));
        tagEl.classList.add('active');
        renderNotes();
    });
});

function saveAndRender() {
    saveNotes();
    renderNotes();
}

saveAndRender();