import express from "express";

const app = express();
const port = 1263;

app.get("/", (request, response) => {
	response.send("Hello World!");
});

app.get("/api/todos", (request, response) => {
	response.json([
		{ id: 1, name: "Buy plants" },
		{ id: 2, name: "Buy cat" },
	]);
});

app.listen(port, () => {
	console.log("Hello World!");
});
