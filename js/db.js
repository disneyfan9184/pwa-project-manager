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

// Set up firestore realtime listener
db.collection('projects').onSnapshot(snapshot => {
  // console.log(snapshot.docChanges());

  // Get array of document changes
  snapshot.docChanges().forEach(change => {
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === 'added' || change.type === 'modified') {
      // Add the document to the web page
      renderProject(change.doc.data(), change.doc.id);
    }

    if (change.type === 'removed') {
      // Remove document from the web page
      removeProject(change.doc.id);
    }
  });
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
  addForm.title.value = '';
  addForm.name.value = '';
  addForm.scope.value = '';
  addForm.due.value = '';
  addForm.status.value = '';
});

// Delete/Edit a recipe
const projectContainer = document.querySelector('.project-details');
projectContainer.addEventListener('click', e => {
  if (e.target.innerHTML === 'delete') {
    const id = e.target.getAttribute('data-id');
    db.collection('projects')
      .doc(id)
      .delete();
  } else if (e.target.innerHTML === 'edit') {
    const id = e.target.getAttribute('data-id');
  }
});
