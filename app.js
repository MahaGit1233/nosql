const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
// const mongoConnect = require("./util/database").mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("68c1a9ca8648ad3dbab921c0")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(() => {
//   app.listen(4000);
// });

mongoose
  .connect(
    "mongodb+srv://nosqlUser:IzFHDCQLdSR951zB@clusternosql.qxinlob.mongodb.net/shop?retryWrites=true&w=majority&appName=ClusterNosql"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Mahathi",
          password: "123456",
          email: "maha@gmail.com",
          phone: "9876543210",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(4000);
    console.log("mongoose connect connected!");
  });
