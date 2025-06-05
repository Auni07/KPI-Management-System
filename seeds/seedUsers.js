const mongoose = require('mongoose');
const User = require('../models/user');

mongoose.connect('mongodb://localhost:27017/kpi_system');

const users = [
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"),
    companyId: "MNG-8012",
    name: "Alice Parker",
    email: "alice.manager@example.com",
    password: "123",
    role: "manager",
    manager: null,
    department: "IT" 
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a2"),
    companyId: "MNG-8013",
    name: "Bob Lee",
    email: "bob.manager@example.com",
    password: "123",
    role: "manager",
    manager: null,
    department: "HR & Admin" 
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b1"),
    companyId: "STF-9001",
    name: "Charlie Staff",
    email: "charlie.staff@example.com",
    password: "123",
    role: "staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"),
    department: "Sales & Marketing"
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b2"),
    companyId: "STF-9002",
    name: "Diana Staff",
    email: "diana.staff@example.com",
    password: "123",
    role: "staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a2"),
    department: "Customer Service"
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b3"),
    companyId: "STF-9003",
    name: "Ethan Staff",
    email: "ethan.staff@example.com",
    password: "123",
    role: "staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"),
    department: "HR & Admin"
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b4"),
    companyId: "STF-9004",
    name: "Ali bin Ahmad",
    email: "ali.staff@example.com",
    password: "123",
    role: "staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a1"),
    department: "IT"
  },
  {
    _id: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362b5"),
    companyId: "STF-9005",
    name: "Aliya Natasha",
    email: "aliya.staff@example.com",
    password: "123",
    role: "staff",
    manager: new mongoose.Types.ObjectId("6659fa9fb6e1c2cf81e362a2"),
    department: "Sales & Marketing"
  }
];

User.insertMany(users)
  .then(() => {
    console.log("Users seeded!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
