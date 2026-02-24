import app from "./app";
const port = process.env.PORT;
export default {
  port: port,
  fetch: app.fetch,
};
