
const stripeSecretKey = "sk_test_51KpmUbSBCMWBXDgKJ1XQjEryrT1NARchJSMnXkIsLuzPIrblmpbCejYFfwVfcLDMxFuUEkeXHdL54FTQsHXO8gBp00SlfyTtK1";

const stripe = require("stripe")(stripeSecretKey);
const Car = require("../models/newCarsModel");


exports.getCheckoutSession = async (req, res, next) => {
    console.log("*** bookingController.js :: getCheckoutSession ***");
    
    try {
        // 1) Get the currently booked Car
        const car = await Car.findById(req.params.carID);
        console.log(car);
      
        // 2) Create checkout session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
          //   req.params.tourId
          // }&user=${req.user.id}&price=${tour.price}`,
          success_url: `${req.protocol}://${req.get('host')}/`,
          cancel_url: `${req.protocol}://${req.get('host')}/`,
        //   customer_email: "req.user.email",
          client_reference_id: req.params.carID,
          line_items: [
            {
              name: "${tour.name} Tour",
              description: "tour.summary",
            //   images: [
            //     `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
            //   ],
              amount: 100,
              currency: 'usd',
              quantity: 1
            }
          ]
        });
      
        // 3) Create session as response
        res.status(200).json({
          status: 'success',
          session
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            status: "fail",
            err
        })
    }
  };












 






