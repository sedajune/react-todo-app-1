import cors from "cors";
import express from "express";
/*import mongoose from "mongoose";*/

import dotenv from "dotenv";
dotenv.config();
import process from "node:process";
import { readFile, writeFile } from "fs/promises";

import { connectDatabase, getTodoCollection } from "./utils/database.js";

if (!process.env.MONGODB_URI) {
	throw new Error("No MONGODB_URI available in dotenv");
}

const app = express();
const port = 1263;

app.use(express.json());
app.use(cors());

app.get("/", (request, response) => {
	response.send("Hello World!");
});

/*app.get("/api/todos", async (request, response) => {
	readFile("./db.json", "utf8")
		.then(data => JSON.parse(data))
		.then(json => {
			response.json(json.todos);
		});
});*/

/*app.get("/api/todos", (request, response) => {
	readFile("./db.json", "utf8").then(data => {
		const json = JSON.parse(data);
		response.json(json.todos);
	});
});*/

const DATABASE_URI = "./db.json";

app.get("/api/todos", async (request, response, next) => {
	try {
		//const data = await readFile(DATABASE_URI, "utf8");
		//const json = JSON.parse(data);
		//response.json(json.todos);
		const mongoDbResponse = await Todo.find();
		response.send(mongoDbResponse);
	} catch (error_) {
		next(error_);
	}
});

/*app.get("/api/todos", (request, response) => {
	response.json([
		{ id: 1, name: "Buy plants" },
		{ id: 2, name: "Buy cat" },
	]);
});*/

app.post("/api/todos", async (request, response, next) => {
	try {
		// const data = await readFile(DATABASE_URI, "utf8");
		// const json = JSON.parse(data);

		const collection = getTodoCollection();

		const newTodo = new Todo({
			...request.body,
			isCompleted: false,
		});

		const mongoDbResponse = await collection.insertOne(todo);

		response
			.status(201)
			.send(`Insertion successful, document id:${mongoDbResponse.insertedId}`);
	} catch (error_) {
		next(error_);
	}
});

app.delete("/api/todos", async (request, response) => {
	const { id } = request.body;
	const data = await readFile(DATABASE_URI, "utf-8");
	const json = JSON.parse(data);
	const index = json.todos.findIndex(user => user.id === id);
	if (index < 0) {
		throw new Error("This entry does not exist");
	}
	json.todos.splice(index, 1);
	await writeFile(DATABASE_URI, JSON.stringify(json, null, 4));

	response.status(204);
	response.send();
});

app.put("/api/todos", async (request, response) => {
	const { id, update } = request.body;
	const data = await readFile(DATABASE_URI, "utf-8");
	const json = JSON.parse(data);
	const index = json.todos.findIndex(user => user.id === id);
	if (index < 0) {
		throw new Error("This entry does not exist");
	}
	json.todos[index] = { ...json.todos[index], ...update, id };
	await writeFile(DATABASE_URI, JSON.stringify(json, null, 4));
	response.status(200);
	response.send(json.todos[index]);
});

connectDatabase(process.env.MONGODB_URI).then(() => {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
});

/* {
  "todos": [
    { "id": 1, "name": "Clean the bathroom" },
    { "id": 2, "name": "Clean the kitchen" },
    { "id": 3, "name": "Clean the rug" },
    { "id": 4, "name": "Clean the floor" },
    {
      "name": "Foo",
      "done": false,
      "id": "something-unique"
    }
  ]
} */

/*// New code
mongoose.connect(process.env.MONGODB_URI).then(() => {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`);
	});
});


app.post("/api/todos", async (request, response, next) => {
	try {

		const todo = new Todo {
			...request.body,
			isChecked: false,
		};

		const mongoDbResponse = await todo.save();


		response.status(201).json(mongoDbResponse);
	} catch (error_) {
		next(error_);
	}
});*/
