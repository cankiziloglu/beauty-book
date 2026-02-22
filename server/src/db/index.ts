import { Database } from "bun:sqlite";

const db = new Database("./beauty-book.sqlite");

export default db;
