const projects = document.querySelector('.project-details');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

// Setup Materialize Components
const sideNav = document.querySelector('.side-menu');
M.Sidenav.init(sideNav, { edge: 'right' });

const sideFormAdd = document.querySelector('.side-form-add');
M.Sidenav.init(sideFormAdd, {});

const sideFormEdit = document.querySelector('.side-form-edit');
M.Sidenav.init(sideFormEdit, {});

const items = document.querySelectorAll('.collapsible');
M.Collapsible.init(items);

const modals = document.querySelectorAll('.modal');
M.Modal.init(modals);

const removeLoginMessage = () => {
  projects.innerHTML = '';
};

// Render project data
const renderProject = (data, id, user) => {
  if (data) {
    const html = `
    <li class="project-item" data-id="${id}">
      <div class="project-title collapsible-header">
        <img src="/img/project.png" alt="project thumbnail" />${data.title}
      </div>
      <div class="collapsible-body white">
        <div class="project-person"> ${data.name}</div>
        <div class="project-description">${data.scope}</div>
        <div class="project-date">
          <label class="grey-text text-darken-1">Due:</label>
          <p class="due">${data.due}</p>
        </div>
        <div class="project-status">
          <label class="grey-text text-darken-1">Status:</label>
          <p class="status">${data.status}</p>
        </div>
        <div class="project-edit sidenav-trigger admin" data-target="side-form-edit">
          <div class="material-icons" data-id="${id}">edit</div>
        </div>
        <div class="project-delete admin">
          <div class="material-icons" data-id="${id}">delete</div>
        </div>
      </div>
    </li>        
       
  `;
    projects.innerHTML += html;
  } else {
    projects.innerHTML =
      '<h6 class="center">Login to view project list...</h6>';
  }
  setupUI(user);
};

const setupUI = user => {
  const adminItems = document.querySelectorAll('.admin');

  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = 'block'));
    }

    // Account info
    db.collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        const html = `
          <h6>Logged in as ${user.email}</h6>
          <div>${doc.data().bio}</div>
          <div class="pink-text">${user.admin ? 'Admin' : ''}
        `;
        accountDetails.innerHTML = html;
      });

    // Toggle UI Elements
    loggedInLinks.forEach(link => (link.style.display = 'block'));
    loggedOutLinks.forEach(link => (link.style.display = 'none'));
  } else {
    adminItems.forEach(item => (item.style.display = 'none'));
    // Hide accounts info
    accountDetails.innerHTML = '';
    // Toggle UI elements
    loggedInLinks.forEach(link => (link.style.display = 'none'));
    loggedOutLinks.forEach(link => (link.style.display = 'block'));
  }

  const projectItems = Array.from(document.querySelectorAll('.project-item'));
  // console.log(projectItems);

  projectItems.forEach(project => {
    let status = project.querySelector('.status');
    // console.log(status.innerText);
    if (status.innerText === 'overdue') {      
      project.classList.add('overdue');
    } else if (status.innerText === 'ongoing') {
      project.classList.add('ongoing');
    } else {
      project.classList.add('complete');
    }
  });
};

// Remove project from DOM
const removeProject = id => {
  const project = document.querySelector(`.project-item[data-id=${id}]`);
  project.remove();
};

// Search Recipe List
const filterInput = document.getElementById('filterTitle');

filterInput.addEventListener('keyup', filterNames);

function filterNames() {
  let filterValue = document.getElementById('filterTitle').value.toUpperCase();
  let items = projects.querySelectorAll('.project-item');

  for (let i = 0; i < items.length; i++) {
    let a = items[i].querySelector('.project-title');

    // If matched
    if (a.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
      items[i].style.display = '';
    } else {
      items[i].style.display = 'none';
    }
  }
}
