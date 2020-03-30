import React from "react";


function TextCircle(country_code,country,x,y,r) {
    return(<text id={country_code} name={country} x={x} y={y} fill="white">{country_code}</text>)

}


export default TextCircle