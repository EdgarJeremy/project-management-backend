import Table from "cli-table2";
import ip from "ip";
import { server } from "../../config.json";
import routes from "../importer/route";
import colors from "colors";

export default (app) => {

    let route_data = {};

    Object.keys(routes).forEach((basepoint) => {
        let raw = routes[basepoint];
        route_data[`/api/${basepoint}`] = { endpoints: [] };
        if (typeof raw === "function") {
            let route = raw(app, null, null);
            route.stack.forEach((info) => {
                let { route } = info;
                if(route) {
                    let endpoint = route.path;
                    let verbs = route.methods;
                    route_data[`/api/${basepoint}`].endpoints.push({ endpoint, verbs: extract_verbs(verbs) });
                }
            });
        }
    });
    
    const table = new Table({ head: ["Basepoint".cyan.bold, "Endpoint".cyan.bold, "HTTP Verb".cyan.bold, "Full URI".cyan.bold] });
    Object.keys(route_data).forEach((basepoint) => {
        let basepoint_data = route_data[basepoint];
        basepoint_data.endpoints.forEach((endpoint_data, i) => {
            if(i === 0) {
                table.push([{ rowSpan: basepoint_data.endpoints.length, content: basepoint, vAlign: "center" }, endpoint_data.endpoint, endpoint_data.verbs, `${server.protocol}://${ip.address()}:${server.port}${basepoint}${endpoint_data.endpoint}`]);
            } else {
                table.push([endpoint_data.endpoint, endpoint_data.verbs, `${server.protocol}://${ip.address()}:${server.port}${basepoint}${endpoint_data.endpoint}`]);
            }
        });
    });
    
    function extract_verbs(verbs) {
        let extracted = "GET";
        Object.keys(verbs).forEach((verb) => {
            if(verbs[verb]) {
                extracted = verb.toUpperCase();
            }
        });
        return extracted;
    }

    return {
        data: route_data,
        string: table.toString()
    };

}
