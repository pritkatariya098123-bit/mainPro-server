import { createServer } from "http";
import { handler } from "./handler.js";


const PORT = 3000;

const server = createServer(handler)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
