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
const renderProject = (data, id) => {
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
          <p class="status"> ${data.status}</p>
        </div>
        <div class="project-edit sidenav-trigger icon" data-target="side-form-edit">
          <div class="material-icons" data-id="${id}">edit</div>
        </div>
        <div class="project-delete icon">
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
};

const setupUI = user => {
  const adminItems = document.querySelectorAll('.admin');
  const icons = document.querySelectorAll('.icon');
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = 'block'));
      console.log(icons);
      console.log(Array.from(icons));
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
};

// Remove project from DOM
const removeProject = id => {
  const project = document.querySelector(`.project-item[data-id=${id}]`);
  project.remove();
};
