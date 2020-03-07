// Add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  const adminEmail = document.getElementById('admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

// Listen for auth status changes - this function fires evertime there is a change
// in the auth status of a user (ie login, logout, etc)
auth.onAuthStateChanged(user => {
  // true if user logged in and null if user logged out
  if (user) {
    // Get data
    // Real-time listener for sending snapshots of database changes
    user.getIdTokenResult().then(idTokenResult => {
      // Add a property to the user that is logged in which will be 'true 'or 'null'

      user.admin = idTokenResult.claims.admin;
      setupUI(user);
      removeLoginMessage();
      db.collection('projects').onSnapshot(
        snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              // Add the document to the web page
              renderProject(change.doc.data(), change.doc.id);
            }

            if (change.type === 'removed') {
              // Remove document from the web page
              removeProject(change.doc.id);
            }
          });
        },
        error => {
          console.log(error.message);
        }
      );
    });
  } else {
    setupUI();
    renderProject(null, null);
  }
});

// Sign up user
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info - look at the signup form that we have a
  // reference to and find inputs that have id's="signup-email" and "signup-password"
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // Sign up the user to firebase - asynchronous task
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      // console.log(cred.user);

      // Firestore will automatically create this collection if it doesn't exist
      return db
        .collection('users')
        .doc(cred.user.uid)
        .set({
          bio: signupForm['signup-bio'].value
        });
    })
    .then(() => {
      const modal = document.getElementById('modal-signup');
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector('.error').innerHTML = '';
    })
    .catch(err => {
      signupForm.querySelector('.error').innerHTML = err.message;
    });
});

// Logout user
const logout = document.getElementById('logout');
logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut();
});

// const sideLogout = document.querySelector('#side-logout');
// sideLogout.addEventListener('click', e => {
//   console.log('side logout clicked');
//   // e.preventDefault();
//   auth.signOut();
// });

// Login user
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      // Close login modal and reset the form
      const modal = document.getElementById('modal-login');
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector('.error').innerHTML = '';
    })
    .catch(err => {
      loginForm.querySelector('.error').innerHTML = err.message;
    });
});
