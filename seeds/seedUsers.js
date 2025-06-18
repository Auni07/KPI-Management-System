const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb://localhost:27017/kpi_system");

const users = [
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"),
    name: "Alice Parker",
    email: "alice.manager@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Manager",
    manager: null,
    department: "Sales & Marketing",
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a2"),
    name: "Bob Lee",
    email: "bob.manager@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Manager",
    manager: null,
    department: "IT",
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    name: "Charlie Puth",
    email: "charlie.staff@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"), // Alice Manager
    department: "Sales & Marketing",
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    name: "Diana Rizq",
    email: "diana.staff@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a2"), // Bob Manager
    department: "Customer Service",
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    name: "Ethan Michael",
    email: "ethan.staff@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"), // Alice Manager
    department: "Sales & Marketing",
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    name: "Ali bin Ahmad",
    email: "ali.staff@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a2"), // bob Manager
    department: "IT",
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    name: "Aliya Natasha",
    email: "aliya.staff@example.com",
    phone: "+60123456789",
    password: "1234",
    role: "Staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"), // alice Manager
    department: "Sales & Marketing",
  },
];

async function seed() {
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  await User.insertMany(users);
  console.log("Users seeded!");
  mongoose.connection.close();
}

seed().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
