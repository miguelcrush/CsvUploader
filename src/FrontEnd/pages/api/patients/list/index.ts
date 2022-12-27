import { NextApiRequest, NextApiResponse } from "next";
import { createImportSpecifier } from "typescript";
import APP_CONFIG from "../../../../config";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method?.toLowerCase() == "get") {
        var url = `${APP_CONFIG.API_BASE_URL}/patients${queryToQueryString(req.query)}`;
        var resp = await fetch(url,
            {
                method: 'get'
            });

        if (!resp.ok) {
            var text = await resp.text();
            return res.status(resp.status).json({ message: text });
        }

        var json = await resp.json();
        return res.status(200).json(json);

    }
    else if (req.method?.toLowerCase() == "post") {

        var url = `${APP_CONFIG.API_BASE_URL}/patients/csv`;
        var resp = await fetch(url, {
            method: "POST",
            body: req.body,
            headers:{
                "Content-Type":  req.headers["content-type"] || ''
            }
        });

        if (!resp.ok) {
            var text = await resp.text();
            console.log(resp.status);
            return res.status(resp.status).json({ message: text });
        }

        var json = await resp.json();
        return res.status(resp.status).json(json);

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
            if (!first) {
                qs += "&";
            }
            qs += `${key}=${query[key]}`;
            first = false;
        }
        return qs;
    }
}