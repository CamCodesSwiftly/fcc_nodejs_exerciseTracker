const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { body, validationResult } = require("express-validator");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

// Hashmap of users because it is way faster than to find a user later
const adminID = generateUniqueId();
const users = [
	{
		_id: adminID,
		username: "admin",
	},
];

app.get("/", (req, res) => {
	console.log(users);
	res.sendFile(__dirname + "/views/index.html");
});

// * USERS
app.route("/api/users")
	//	* CREATE
	.post((req, res) => {
		const newUser = {
			_id: generateUniqueId(),
			username: req.body.username,
		};

		users.push(newUser);

		res.json({ ...newUser });
	})
	//	* READ
	.get((req, res) => {
		res.json(users);
	});

// * EXERCISES
app.post("/api/users/:_id/exercises", body("date").notEmpty(), (req, res) => {
	// handle date
	let currentDateFormatted = "";
	if (!validationResult(req).isEmpty()) {
		const currentDate = new Date();
		currentDateFormatted = currentDate.toDateString();
	} else {
		const providedDate = new Date(req.body.date);
		currentDateFormatted = providedDate.toDateString();
	}

	//find user with id
	const foundUser = users.find((user) => {
		console.log(user);
		if (user._id == req.params._id) {
			return user;
		}
	});
	//create exercise
	const exercise = {
		description: req.body.description,
		duration: parseInt(req.body.duration, 10),
		date: currentDateFormatted,
	};

	res.json({ ...foundUser, ...exercise });
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log(adminID);
	console.log("Your app is listening on port " + listener.address().port);
});

// * CREATE ID's
function generateUniqueId() {
	// Timestamp part
	const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
	// Random part
	const random = ((Math.random() * 0x100000000) | 0).toString(16);
	// Incrementing counter, initialized to a random value
	const counter = ((Math.random() * 0x100000) | 0).toString(16);
	// Combine the parts
	const objectId =
		timestamp +
		"0000000000000000".slice(random.length) +
		random +
		"000000".slice(counter.length) +
		counter;
	return objectId;
}
