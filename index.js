const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { body, query, validationResult } = require("express-validator");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

//Data and Test Data
const adminID = generateUniqueId();
const users = [
	{
		_id: adminID,
		username: "admin",
	},
];
const today = new Date().toDateString();
const squatsAdmin = {
	_id: adminID,
	duration: 2,
	description: "squats",
	date: today,
};
const pullUpsAdmin = {
	_id: adminID,
	duration: 2,
	description: "pull ups",
	date: today,
};
const pushUpsAdmin = {
	_id: adminID,
	duration: 2,
	description: "push ups",
	date: "Wed Feb 02 2022",
};
const crunchesAdmin = {
	_id: adminID,
	duration: 2,
	description: "crunches",
	date: "Wed Feb 02 2022",
};
const exercises = [];
exercises.push(squatsAdmin);
exercises.push(pullUpsAdmin);
exercises.push(pushUpsAdmin);
exercises.push(crunchesAdmin);


// * HOME
app.get("/", (req, res) => {
	console.table(users);
	console.table(exercises);
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
		if (user._id == req.params._id) {
			return user;
		}
	});
	//create exercise
	const exercise = {
		_id: foundUser._id,
		description: req.body.description,
		duration: parseInt(req.body.duration, 10),
		date: currentDateFormatted,
	};

	exercises.push(exercise);

	res.json({ username: foundUser.username, ...exercise });
});


// * EXERCISE LOGS
app.get(
	"/api/users/:_id/logs",
	[
		query("from").optional().isISO8601().toDate(),
		query("to").optional().isISO8601().toDate(),
		query("limit").optional().isInt({ min: 1 }),
	],
	(req, res) => {
		//validate from, to and limit queries
		if (!validationResult(req).isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const fromDate = Date.parse(req.query.from);
		const toDate = Date.parse(req.query.to);
		const limit = parseInt(req.query.limit, 10);

		// find the exercises, filter and limit them with the queries
		const foundExercises = exercises
			.filter((exercise) => exercise._id === req.params._id)
			.filter(
				(exercise) => !fromDate || new Date(exercise.date) >= fromDate
			)
			.filter((exercise) => !toDate || new Date(exercise.date) <= toDate)
			.slice(0, limit || exercises.length);


		const count = foundExercises.length;
		const foundUser = users.find((user) => user._id === req.params._id);

		res.json({
			...foundUser,
			count: count,
			log: foundExercises,
		});
	}
);

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log(
		`127.0.0.1:3000/api/users/${adminID}/logs?from=2024-01-01&to=2024-02-19&limit=1`
	);
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
