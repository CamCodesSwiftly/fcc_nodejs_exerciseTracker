const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

const users = [
	{
		username: "Admin",
		_id: generateUniqueId(),
	},
];

app.get("/", (req, res) => {
	console.log(users);
	res.sendFile(__dirname + "/views/index.html");
});

// app.post("/api/users", (req, res) => {
// 	const user = {
// 		username: req.body.username,
// 		_id: generateUniqueId(),
// 	};

// 	users.push(user);

// 	res.json({
// 		username: user.username,
// 		_id: user._id,
// 	});
// });

// app.get("/api/users", (req, res) => {
// 	res.json(users);
// });

// * USERS
app.route("/api/users")
	//	* CREATE
	.post((req, res) => {
		const user = {
			username: req.body.username,
			_id: generateUniqueId(),
		};

		users.push(user);

		res.json({
			username: user.username,
			_id: user._id,
		});
	})
	//	* READ
	.get((req, res) => {
		res.json(users);
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
