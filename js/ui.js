// Initialize side-nav
const sideNav = document.querySelector('.side-menu');
M.Sidenav.init(sideNav, { edge: 'right' });

const sideFormAdd = document.querySelector('.side-form-add');
M.Sidenav.init(sideFormAdd, {});

const items = document.querySelectorAll('.collapsible');
M.Collapsible.init(items);
