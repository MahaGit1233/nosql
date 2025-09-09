const mondodb = require("mongodb");
const { getDb } = require("../util/database");

const ObjectId = mondodb.ObjectId;

class User {
  constructor(name, password, email, phone, cart, id) {
    this.name = name;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.cart = cart ? cart : { items: [] };
    this._id = id;
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

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartIems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartIems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartIems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartIems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
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

  deleteById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) })
      .then((user) => {
        console.log("Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
