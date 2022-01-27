import { MongoClient } from "mongodb";

let client;

export async function connectDatabase(url) {
	client = new MongoClient(url);
	await client.connect();
}

export function getTodoCollection() {
	return client.db().collection(`todos`);
}

export function getCollection(name) {
	return client.db().collection(name);
}

export function getTodoCollection() {
	return getCollection(`todos`);
}

export function getUserCollection() {
	return getCollection(`users`);
}
