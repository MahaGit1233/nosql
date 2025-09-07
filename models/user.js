const { getDb } = require("../utils/db_connection");

class User {
  constructor(name, password, email, phone) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.phone = phone;
  }

  save() {
    const db = getDb;
    console.log("db from user modal", db);
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("result from user modal then", result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
