// Offline data synced with built in IndexedDB database in browser
db.enablePersistence().catch(err => {
  if (err.code === 'failed-precondition') {
    // multiple tabs are open at once
    console.log('persistence failed');
  } else if (err.code === 'unimplemented') {
    // lack of browser support
    console.log('persistence is not available');
  }
});

// Add new project
const addForm = document.querySelector('.add-project');
addForm.addEventListener('submit', e => {
  e.preventDefault();

  const project = {
    title: addForm.title.value,
    name: addForm.name.value,
    scope: addForm.scope.value,
    due: addForm.due.value,
    status: addForm.status.value
  };

  db.collection('projects')
    .add(project)
    .catch(err => console.log(err));

  // Clear form fields
  addForm.reset();

  // addForm.title.value = '';
  // addForm.name.value = '';
  // addForm.scope.value = '';
  // addForm.due.value = '';
  // addForm.status.value = '';
});

// Delete/Edit a recipe
const projectContainer = document.querySelector('.project-details');
projectContainer.addEventListener('click', e => {
  if (e.target.innerHTML === 'delete') {
    const id = e.target.getAttribute('data-id');
    if (confirm('Are you sure you want to delete project?')) {
      db.collection('projects')
        .doc(id)
        .delete();
    } else {
      return;
    }
  } else if (e.target.innerHTML === 'edit') {
    const id = e.target.getAttribute('data-id');
    const editForm = document.querySelector('.edit-project');
    const title = editForm.querySelector('#editTitle');
    const name = editForm.querySelector('#editName');
    const scope = editForm.querySelector('#editScope');
    const date = editForm.querySelector('#editDue');
    const status = editForm.querySelector('#editStatus');
    const project = document.querySelectorAll('.project-item');
    project.forEach(p => {
      const dataId = p.getAttribute('data-id');
      if (dataId === id) {
        title.value = p.querySelector('.project-title').innerText;
        name.value = p.querySelector('.project-person').innerText;
        scope.value = p.querySelector('.project-description').innerText;
        date.value = p.querySelector('.due').innerText;
        status.value = p.querySelector('.status').innerText;

        editForm.addEventListener('submit', e => {
          const projectData = {
            title: title.value,
            name: name.value,
            scope: scope.value,
            due: date.value,
            status: status.value
          };
          db.collection('projects')
            .doc(id)
            .update(projectData)
            .catch(err => console.log(err));

          editForm.reset();
          // title.value = '';
          // name.value = '';
          // scope.value = '';
          // date.value = '';
          // status.value = '';
        });
      }
    });
  }
});
