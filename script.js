const addBox = document.querySelector('.add-box'),
      popupBox = document.querySelector('.popup-box'),
      popupTitle = popupBox.querySelector('header p'),
      closeIcon = popupBox.querySelector('header i'),
      titleTag = popupBox.querySelector('input'),
      descTag = popupBox.querySelector('textarea'),
      dateTag = popupBox.querySelector('span'),
      addBtn = popupBox.querySelector('button');
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
  titleTag.value = descTag.value = dateTag.innerText = '';
  popupBox.classList.remove('show');
  document.querySelector('body').style.overflow = 'auto';
});

addBtn.addEventListener('click', e => {
  e.preventDefault();
  let currentDate = new Date(),
      formattedCurrentDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}hs.`;

  let title = titleTag.value.trim(),
      description = descTag.value.trim(),
      dateCreated = dateTag.innerText !== '' ? dateTag.innerText : formattedCurrentDate;

  if (!title.trim() || !description.trim()) {
    alert('You must enter the description and the title!');
    return false;
  }

  let noteInfo = { title, description, dateCreated };
  if (!isUpdate) {
    notes.push(noteInfo);
  } else {
    noteInfo.dateModified = formattedCurrentDate;
    isUpdate = false;
    notes[updateId] = noteInfo;
  }
  // save data from database
  localStorage.setItem('notes', JSON.stringify(notes));
  showNotes();
  closeIcon.click();
});


// actions
const showNotes = function () {
  if (!notes) {
    return false;
  }
  document.querySelectorAll('.note').forEach(li => li.remove());
  notes.forEach((note, id) => {
    let filterDesc = note.description.replaceAll('\n', '<br/>'),
        objNote = encodeURI(JSON.stringify(note));
        console.log(note);

    let liTag = `<li class="note">
                  <div class="details">
                    <p>${note.title}</p>
                    <span>${filterDesc}</span>
                  </div>
                  <div class="bottom-content">
                    <div>
                      <span>${note.dateCreated || '&nbsp;'}</span>
                      <span>${note.dateModified || '&nbsp;'}</span>
                    </div>
                    <div class="settings">
                      <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                      <ul class="menu">
                        <li onclick="updateNote(${id}, '${objNote}')"><i class="uil uil-pen"></i>Edit</li>
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

const updateNote = function (id, note) {
  let objNote = JSON.parse(decodeURI(note));
  updateId = id;
  isUpdate = !isUpdate;
  addBox.click();
  titleTag.value = objNote.title;
  descTag.value = objNote.description;
  dateTag.innerText = objNote.dateCreated;
  popupTitle.innerText = 'Update a Note';
  addBtn.innerText = 'Update Note';
}

// show grid data
showNotes();