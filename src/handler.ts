import { IncomingMessage, ServerResponse } from "http";

export const handler = (req: IncomingMessage, res: ServerResponse) => {
    console.log(`---- HTTP Method: ${req.method}, URL: ${req.url} ----`);
    console.log(`host: ${req.headers.host}`);

    const parsedURL = new URL(req.url || "", `http://${req.headers.host}`);

    console.log(`protocol: ${parsedURL.protocol}`);
    console.log(`hostname: ${parsedURL.hostname}`);
    console.log(`port: ${parsedURL.port}`);
    console.log(`pathname: ${parsedURL.pathname}`);
    parsedURL.searchParams.forEach((value, name) => {
        console.log(`query param: ${name} = ${value}`);
    });

    if (req.method === "GET" && parsedURL.pathname === "/favicon.ico") {
        res.writeHead(404, "Not Found");
        res.end();
        return;
    } else {
        res.writeHead(200, "OK");
        if (!parsedURL.searchParams.has("keyboard")) {
            res.write("Hello, World!");
        } else {
            res.write(`Hello, ${parsedURL.searchParams.get("keyboard")}!`);
        }
    }
    


    res.end();
} 