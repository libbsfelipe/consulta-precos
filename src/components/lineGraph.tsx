import { useState } from "react";
import { LineChart, XAxis, Tooltip, CartesianGrid, Line, YAxis, Legend, ComposedChart, Area } from "recharts";
import { Double } from "typeorm";

interface PriceHistory {
    id: number;
    storeId: number;
    ean: string;
    price: number;
    timestamp: string;
}

export default function LineGraph( props ) {
    const [data, setData] = useState<PriceHistory[]>(props.data);

    return (
        <ComposedChart 
            width={800} height={350} data={data}
            margin={{ top: 5, right: 40, left: 20, bottom: 5 }}            
        >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ACEFF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ACEFF" stopOpacity={0.15}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip  />
            <Area dataKey="price" fillOpacity={1} fill="url(#colorPrice)" stroke="#00AEEF" strokeWidth={3} />
        </ComposedChart >
    )
}