import React from "react";


function DrawCircle(country_code,country,x,y,r,allIll) {
    return(<circle key={x+":"+y+":"+country_code+":"+country} cx={x} cy={y} r={r} fill="red" fillOpacity={0.5}><title>{country}-{allIll}</title></circle>)//<text name={province} fill="white">0</text>)
    }


export default DrawCircle