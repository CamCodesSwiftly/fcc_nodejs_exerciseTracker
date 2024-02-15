const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

// Hashmap of users because it is way faster than to find a user later
const usersMap = new Map();
const adminID = generateUniqueId();
usersMap.set(adminID, "Admin");

//!ABANDON LATER
// const users = [
// 	{
// 		username: "Admin",
// 		_id: generateUniqueId(),
// 	},
// ];

app.get("/", (req, res) => {
	console.log(usersMap);
	res.sendFile(__dirname + "/views/index.html");
});

// * USERS
app.route("/api/users")
	//	* CREATE
	.post((req, res) => {
		const user = {
			username: req.body.username,
			_id: generateUniqueId(),
		};

		usersMap.set(user._id, user.username);

		//!ABANDON LATER
		// users.push(user);

		res.json({
			username: user.username,
			_id: user._id,
		});
	})
	//	* READ
	.get((req, res) => {
		//transform hashmap to json format
		const usersArray = Array.from(usersMap, ([_id, username]) => ({
			username,
			_id,
		}));

		console.log(usersMap);
		res.json(usersArray);
	});

// * EXERCISES
app.route("/api/users/:_id/exercises")
	// Create exercise for admin user
	.post((req, res) => {
		console.log(req.params._id);
		res.json({
			username: "fischen wir gleich raus",
			description: req.body.description,
			duration: req.body.duration,
			date: req.body.date,
			_id: req.params._id,
		});
	})
	.get((req, res) => {
		return;
	});

const listener = app.listen(process.env.PORT || 3000, () => {
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
