import { MongoClient } from "mongodb";

let client;

export async function connectDatabase(url) {
	client = new MongoClient(url);
	await client.connect();
}

export function getTodoCollection() {
	return client.db().collection(`todos`);
}

// Function assignment

// export function getCollection(name) {
//	return client.db().collection(name);
// }

// Alternate functions with more modularity

// export function getTodoCollection() {
//	return getCollection(`todos`);
//}

// export function getUserCollection() {
//	return getCollection(`users`);
// }
