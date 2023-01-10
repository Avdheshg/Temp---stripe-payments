console.log("== running  == ")
// import axios from "/axios";

// ------   Alerts   ------ 
// console.log("running alerts");
const hideAlert = () => {
    console.log("*** login.js => hideAlert  ***");
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
    console.log("*** login.js => showAlter  ***");
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};



// ============   LOGIN    ============ 
const loginForm = document.querySelector(".form--login");
if (loginForm) {
    console.log("*** login.js => 1. loginForm  ***");    
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // console.log("email", email, " password", password);
        login(email, password);       
    })
}

const login = async (email, password) => {
    console.log("*** login.js => 2. Login Function  ***");
    try {
        console.log("Making a POST request in axios to /login route");

        const res = await axios({
            method: 'POST',
            url: '/login',
            data: {       
                email,
                password
            }
        })

        console.log("POST req completed to /login route and the data is received. Now calling the home MW ");
        console.log(res);

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/carDetails');         
            }, 200);    
        }    
 
    } catch (err) {           
        console.log(err);
        showAlert("error", err.response.data.message);   
    }
}

// ============   LogOut    ============ 
const logoutFunction = async () => {
    console.log("*** login.js => 3. logoutFunction  ***");  
    try {

        var res;
        try {
            res = await axios({
              method: 'GET',  
              url: '/logout'
            });    
            console.log("response from the /logout route", res);        
        } catch (err) {
            console.log("axios error", err);         
        }     
         

      if ((res.data.status = 'success')) {
        showAlert('success', 'Logged out successfully!');
        // location.reload(true);  
        window.setTimeout(() => {
            location.assign('/login'); 
        }, 2000);

      }           
    } catch (err) {                
      console.log(err);    
      showAlert('error', 'Error logging out! Try again.');      
    }     
};  
   
const logoutBtn = document.querySelector(".logout");
if (logoutBtn) {    
    console.log("*** login.js => 4. logoutBtn  ***");
    // console.log("logoutBtn present", logoutBtn);
    logoutBtn.addEventListener("click", logoutFunction);
}    
      
// ============   STRIPE    ============ 
const stripe = Stripe('pk_test_51KpmUbSBCMWBXDgK2FzvAYGeudRKsTBjgamSnxEBAmsZggYohMDrBRg9BEe6CxBml3IBTW80dR7SV8ZLUxzxLmdC00Wj0S8h8P');

export const bookCar = async carID => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/bookings/checkout-session/${carID}`);
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const bookBtn = document.getElementById('book-car');
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...'; 
    const { tourId } = e.target.dataset;
    bookCar(tourId);  
});  






























