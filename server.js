import cors from "cors";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { readFile, writeFile } from "fs/promises";
import { v4 as uuid } from "uuid";
import { connectDatabase } from "./utils/database";

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

app.get("/api/todos", async (request, response) => {
	const data = await readFile(DATABASE_URI, "utf8");
	const json = JSON.parse(data);
	response.json(json.todos);
});

/*app.get("/api/todos", (request, response) => {
	response.json([
		{ id: 1, name: "Buy plants" },
		{ id: 2, name: "Buy cat" },
	]);
});*/

app.post("/api/todos", async (request, response) => {
	const data = await readFile(DATABASE_URI, "utf8");
	const json = JSON.parse(data);

	const todo = {
		...request.body,
		isChecked: false,
		id: uuid(),
	};

	json.todos.push(todo);
	await writeFile(DATABASE_URI, JSON.stringify(json, null, 4));
	response.status(201);
	response.json(todo);
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
