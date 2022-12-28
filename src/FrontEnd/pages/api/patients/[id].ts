import { NextApiRequest, NextApiResponse } from "next";
import APP_CONFIG from "../../../config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch(req.method?.toLowerCase()){
        case "put":
            var url = `${APP_CONFIG.API_BASE_URL}/patients/${req.query.id}`;
            var resp = await fetch(url, {
                method:'put',
                body: req.body,
                headers:{
                    "Content-Type": "application/json",
                    apikey: APP_CONFIG.API_KEY || ''
                }
            });
            if(!resp.ok){
                var text = await resp.text();
                return res.status(resp.status).json({message: text });
            }
            
            var json = await resp.json();
            return res.status(200).json(json);
        default:
            return res.status(405).json({message: "method not supported"});
    }
}