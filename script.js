const addBox = document.querySelector('.add-box'),
      popupBox = document.querySelector('.popup-box'),
      popupTitle = popupBox.querySelector('header p'),
      closeIcon = popupBox.querySelector('header i'),
      titleTag = popupBox.querySelector('input'),
      descTag = popupBox.querySelector('textarea'),
      addBtn = popupBox.querySelector('button');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let isUpdate = false,
    updateId;

// initialize database
const notes = JSON.parse(localStorage.getItem('notes') || '[]');


// events
addBox.addEventListener('click', () => {
  popupTitle.innerText = 'Add a new note';
  addBtn.innerText = 'Add note';
  popupBox.classList.add('show');
  document.querySelector('body').style.overflow = 'hidden';
  if (window.innerWidth > 660) {
    titleTag.focus();
  }
});

closeIcon.addEventListener('click', () => {
  isUpdate = false;
  titleTag.value = descTag.value = '';
  popupBox.classList.remove('show');
  document.querySelector('body').style.overflow = 'auto';
});

addBtn.addEventListener('click', e => {
  e.preventDefault();
  let title = titleTag.value.trim(),
      description = descTag.value.trim();
  
  if (title || description) {
    let currentDate = new Date(),
        month = months[currentDate.getMonth()],
        day = currentDate.getDate(),
        year = currentDate.getFullYear();
    
    let noteInfo = { title, description, date: `${month} ${day}, ${year}` };
    if (!isUpdate) {
      notes.push(noteInfo);
    } else {
      isUpdate = false;
      notes[updateId] = noteInfo;
    }
    // save data from database
    localStorage.setItem('notes', JSON.stringify(notes));
    showNotes();
    closeIcon.click();
  }
});


// actions
const showNotes = function () {
  if (!notes) {
    return false;
  }
  document.querySelectorAll('.note').forEach(li => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll('\n', '<br/>');
    let liTag = `<li class="note">
                  <div class="details">
                    <p>${note.title}</p>
                    <span>${filterDesc}</span>
                  </div>
                  <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="menu">
                        <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                        <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                      </ul>
                    </div>
                  </div>
                </li>`;
    addBox.insertAdjacentHTML('afterend', liTag);
  });
}

const showMenu = function (elem) {
  elem.parentElement.classList.add('show');
  document.addEventListener('click', e => {
    if (e.target.tagName != 'I' || e.target != elem) {
      elem.parentElement.classList.remove('show');
    }
  });
}

const deleteNote = function (id) {
  if (!confirm('Are you sure you want to delete this note?')) {
    return false;
  }
  notes.splice(id, 1);
  // delete data from database
  localStorage.setItem('notes', JSON.stringify(notes));
  showNotes();
}

const updateNote = function (id, title, filterDesc) {
  let description = filterDesc.replaceAll('<br/>', '\r\n');
  updateId = id;
  isUpdate = !isUpdate;
  addBox.click();
  titleTag.value = title;
  descTag.value = description;
  popupTitle.innerText = 'Update a Note';
  addBtn.innerText = 'Update Note';
}

// 
showNotes();