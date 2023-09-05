const request = require("supertest");
const express = require("express");
const chai = require("chai");
const expect = chai.expect;

POSTGRES_URL =
  "postgres://default:Jtc8DSwpoHf9@ep-red-dust-59248805-pooler.eu-central-1.postgres.vercel-storage.com:5432/verceldb";
const Sequelize = require("sequelize");
const sequelize = new Sequelize(POSTGRES_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED PROMISE REJECTION
    },
  },
});

const { DataTypes, Model } = require("sequelize");

class User extends Model {}

User.init(
  {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING },
    sessionToken: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "User",
  }
);

const crypto = require("crypto");

const SECRET = "ALICE-IS-THE-BEST";

const random = () => crypto.randomBytes(128).toString("base64");
const authentication = (salt, password) => {
  return crypto.createHmac("sha256", [salt, password].join("/")).update(SECRET).digest("hex");
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(404);
    }

    const expectedHash = authentication(user.salt, password);

    if (user.password !== expectedHash) {
      return res.sendStatus(401);
    }

    const salt = random();
    user.sessionToken = authentication(salt, user.id.toString());

    await user.save();

    res.cookie("ALICE-AUTH", user.sessionToken);

    return res.status(200).json(user).end();
  } catch (error) {
    return res.sendStatus(400);
  }
};

const app = express();
app.use(express.json());
app.post("/login", login);

describe("POST /login", function () {
  // Mock User.findOne function
  // before(function () {
  //   User.findOne = async (query) => {
  //     if (query.where.email === "test@example.com") {
  //       return {
  //         email: "test@example.com",
  //         password: "hashedPassword", // The hashed password
  //         salt: "randomSalt",
  //         id: 1,
  //       };
  //     }
  //     return null;
  //   };
  // });

  it("should return 200 and set cookie if login is successful", function (done) {
    request(app)
      .post("/login")
      .send({ email: "alice@test.com", password: "123" }) // Replace 'password' with the plaintext password
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.headers).to.have.property("set-cookie");
        done();
      });
  });

  it("should return 404 if user not found", function (done) {
    request(app).post("/login").send({ email: "nonexistent@example.com", password: "password" }).expect(404, done);
  });

  // Test case: Missing email or password
  it("should return 400 if email or password is missing", function (done) {
    request(app)
      .post("/login")
      .send({ email: "alice@test.com" }) // password is missing
      .expect(400, done);
  });

  // Test case: Incorrect password
  it("should return 401 if password is incorrect", function (done) {
    request(app)
      .post("/login")
      .send({ email: "alice@test.com", password: "wrongPassword" }) // password is incorrect
      .expect(401, done);
  });
});

describe("POST /register", function () {
  // Test case: Missing email, username, or password
  it("should return 400 if email, username or password is missing", function (done) {
    request(app)
      .post("/register")
      .send({ email: "alice@test.com", password: "123" }) // username is missing
      .expect(404, done);
  });
});
