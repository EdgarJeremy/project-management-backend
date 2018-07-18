import express from "express";
import getRouteData from "./route";

const action = process.argv[2];

if(action === "routes") {
    /**
     * Inspect routes
     */
    const fake_app = express();
    fake_app.set("express", express);
    const info = getRouteData(fake_app);
    console.log(info.string);
} else if(action === "models") {
    /**
     * Inspect models
     */
}
