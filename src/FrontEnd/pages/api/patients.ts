import { NextApiRequest, NextApiResponse } from "next";
import config from "../../config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('api: ' + config.API_BASE_URL);
    if (req.method?.toLowerCase() == "get") {
        var url = `${config.API_BASE_URL}/patients${queryToQueryString(req.query)}`;
        console.log(url);
        var resp = await fetch(url,
            {
                method: 'get'
            });

        if (!resp.ok) {
            var text = await resp.text();
            return res.status(resp.status).json({ message: text });
        }
        else {
            var json = await resp.json();
            return res.status(200).json(json);
        }
    }
}

const queryToQueryString = (query: any) => {
    if (!query) {
        return "";
    }
    else {
        var qs = "?";
        var first = true;
        for (const key in query) {
            if(!first){
                qs += "&";
            }
            qs += `${key}=${query[key]}`;
            first = false;
        }
        return qs;
    }
}