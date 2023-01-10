/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_51KpmUbSBCMWBXDgK2FzvAYGeudRKsTBjgamSnxEBAmsZggYohMDrBRg9BEe6CxBml3IBTW80dR7SV8ZLUxzxLmdC00Wj0S8h8P');

export const bookCar = async carID => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/bookings/checkout-session/${carID}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
