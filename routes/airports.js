const router = require("express").Router();
const { Flight } = require("../models/plain");
const { User } = require("../models/user");

router.get("/get", (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  //console.log(req);
  Flight.find({}, null, { timeout: 30000 })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: "something went wrong" });
    });
});
router.post("/put/id", (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  //console.log(req);
  const id = req.body._id;
  Flight.findOneAndUpdate({ _id: id }, req.body)
    .then((data) => {
      res.status(200).send({ data: data, message: "Updated successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: "something went wrong" });
    });
});
router.post("/delete/id", (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  //console.log(req);
  const id = req.body._id;
  Flight.findOneAndDelete({ _id: id })
    .then((data) => {
      res.status(200).send({ data: data, message: "Deleted successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: "something went wrong" });
    });
});
router.post("/get/id", (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  //console.log(req);
  const id = req.body._id;
  Flight.findOne({ _id: id })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ message: "something went wrong" });
    });
});

router.post("/get/bookings", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  //console.log(req);
  const userId = req.body.userId;
  const bookingId = req.body.bookingId;
  User.findOne({ _id: userId })

    .then(async (user) => {
      console.log(user);
      if (!user) {
        // User not found
        console.log("User not Found");
        return;
      }
      var Data = [];
      await Flight.find({ _id: bookingId }, null, { timeout: 30000 })
        .then((data) => {
          //res.status(200).send(data);
          Data = data;
        })
        .catch((error) => {
          // console.log(error);
          res.status(500).send({ message: "something went wrong" });
        });

      // Find the index of the booking in the myBookings array
      //console.log(user.myBookings.length);
      const bookingIndex = user.myBookings.findIndex(
        (booking) => booking._id.toString() === bookingId
      );
      //console.log(bookingIndex);
      if (bookingIndex === -1) {
        // Booking not found
        // console.log("Not Found");
        res.status(200).send({ data: Data });

        return;
      }

      // Retrieve the booking object from the myBookings array
      const booking = user.myBookings[bookingIndex];
      res.status(200).send({ data: Data, myBooking: booking });
      // Do something with the booking object
      // console.log(booking);
    })
    .catch((error) => {
      // Handle the error
      console.error("Error", error);
    });
});
router.post("/put/bookings", async (req, res) => {
  console.log(req);
  const userId = req.body.userId;
  const booking = req.body.myBooking;
  const data = req.body.data;

  const filter = { _id: userId };
  const update = { $addToSet: { myBookings: booking } };
  //const options = { upsert: true, new: true };
  // const result = await User.findOneAndUpdate(filter, update)
  //   .then((update) => {
  //     console.log("Value Added");
  //     res.status(200).send("Booked successfully");
  //   })
  //   .catch((error) => {
  //     console.log("Something went wrong");
  //     res.status(500).send("Something went wrong");
  //   });
  await User.findOneAndUpdate(
    { _id: userId, "myBookings._id": booking._id },
    { $set: { "myBookings.$": booking } },
    { new: true }
  )
    .then((updatedFlight) => {
      if (!updatedFlight) {
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { myBookings: booking } },
          { new: true }
        );
      }
      //return updatedFlight;
      console.log("updated");
    })
    .then((updatedFlight) => {
      // do something with the updated flight record
    })
    .catch((err) => {
      // handle error
    });

  // Flight.findOneAndUpdate({ _id: data._id }, data)
  //   .then((update) => {
  //     console.log("Updated Flight");
  //     res.status(200).send("Updated");
  //   })
  //   .catch((error) => {
  //     console.log("Something wrong");
  //     res.status(500).send("Something went wrong");
  //   });
  var flightId = booking._id;
  var numSeatsToBook = booking.seats;
  var bookedDate = booking.bookedDate;
  await Flight.findOneAndUpdate(
    {
      _id: flightId,
      "bookings._id": userId,
      seats: { $gte: numSeatsToBook },
    },
    {
      $inc: { seats: -numSeatsToBook, "bookings.$.seats": numSeatsToBook },
      $set: { "bookings.$.bookedDate": new Date() },
    },
    {
      new: true,
    }
  )
    .then((updatedFlight) => {
      if (updatedFlight) {
        // An existing booking was updated
        console.log("Updated flight:", updatedFlight);
        res.status(200).send("Booked Successfully");
      } else {
        // No existing booking was found, create a new one
        Flight.findOneAndUpdate(
          {
            _id: flightId,
            seats: { $gte: numSeatsToBook },
          },
          {
            $inc: { seats: -numSeatsToBook },
            $addToSet: {
              bookings: {
                _id: userId,
                seats: numSeatsToBook,
                bookedDate: new Date(),
              },
            },
          },
          {
            new: true,
          }
        )
          .then((updatedFlight) => {
            console.log("Updated flight:", updatedFlight);
            res.status(200).send("Booked Successfully");
          })
          .catch((err) => {
            console.error("Error:", err);
          });
      }
    })
    .catch((err) => {
      console.error("Error:", err);
    });

  //res.status(200).send("Booked Successfully");
});

router.post("/put", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    //console.log(req.body);
    await new Flight({ ...req.body })
      .save()
      .then((savedData) => {
        res
          .status(201)
          .send({ data: savedData, message: "Saved successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal server error");
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/get/myBookings", async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  try {
    //console.log(req.body);
    const userId = req.body.userId;
    await User.findById(userId)
      .populate("myBookings._id")
      .exec()
      .then((user) => {
        console.log(user);
        res.status(200).send(user);
      })
      .catch((err) => {
        console.log(err.stack);
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/get/adminBookings", async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.body.userId;
    await Flight.findById(userId)
      .populate("bookings._id")
      .exec()
      .then((user) => {
        console.log(user);
        res.status(200).send(user);
      })
      .catch((err) => {
        console.log(err.stack);
      });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
