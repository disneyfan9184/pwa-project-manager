// Sign up user
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info - look at the signup form that we have a
  // reference to and find inputs that have id's="signup-email" and "signup-password"
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // console.log(email, password);

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
    });
});

// Logout user
const logout = document.getElementById('logout');
logout.addEventListener('click', e => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log('user logged out');
  });
});

// Login user
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    console.log('user logged in');
  });

  // Close login modal and reset the form
  const modal = document.getElementById('modal-login');
  M.Modal.getInstance(modal).close();
  loginForm.reset();
});
