import React, {Component} from 'react';
import './App.css';
import world from './world.svg'
import DrawCircle from './Circle';
//import TextCircle from "./Text";

const MAP_WIDTH = 1280;
const MAP_HEIGHT = 640;
const longitude_shift = 60;
const x_pos = 54;
const y_pos = 19;
//const maxRadius=20;



class  App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:null,
            countriescoordinates:null
        };
    }

    convert(lat, long){
        lat = lat * Math.PI/180;
        let yy = Math.log(Math.tan((lat / 2) + (Math.PI / 4)));
        let y=(MAP_HEIGHT/2)-(MAP_WIDTH*yy/(2*Math.PI))+y_pos;
        let x = (MAP_WIDTH * (180 - long) / 360) % MAP_WIDTH + longitude_shift;
        x -= x_pos;
        y -= y_pos;

        return {x:x*0.99-2,y:y*0.83+45};
    }


    drawCircles = () => {
        const data=this.state.data;
        const countriescoordinates=this.state.countriescoordinates
        const circles=[];
        let r;
        const countries={};

        for (let location of data.confirmed.locations) {
            let country = countries[location.country_code];
            const lat = parseFloat(location.coordinates.lat)
            const long = parseFloat(location.coordinates.long)
            if (country == null) {
                let countrycoor = countriescoordinates.find((coor)=>coor.country_code == location.country_code );
                if(countrycoor == undefined)
                {
                    continue;
                }
                console.log(countriescoordinates)
                country = {
                    countryName: location.country,
                    allIll: 0,
                    lat:countrycoor.latlng[0],
                    long:countrycoor.latlng[1]
                }
            }
            country.allIll += location.latest;
            /*if (country.minLat > lat) {
                country.minLat = lat
            }
            if (country.maxLat < lat) {
                country.maxLat = lat
            }
            if (country.minLong > long) {
                country.minLong = long
            }
            if (country.maxLong < long) {
                country.maxLong = long
            }*/
            countries[location.country_code] = country;
        }


        for (let key in countries ) {
            const country=countries[key];
            const coordinates = this.convert(country.lat, country.long);
            console.log(coordinates);
            r =country.allIll != 0 ? 5+country.allIll*3/10000 : 0 ;
            circles.push(DrawCircle(key,country.countryName,MAP_WIDTH-coordinates.x, coordinates.y, r,country.allIll));


        }
        return circles;

    }

    /*textCircles = () => {
        const data=this.state.data;
        const province=[];
        let r;

        for (let location of data.confirmed.locations) {
            const coordinates = this.convert(location.coordinates.lat, location.coordinates.long);
            r =countries.latest != 0 ? 5+location.latest*2/10000 : 0 ;
            province.push(TextCircle(location.country_code,location.country,MAP_WIDTH-coordinates.x, coordinates.y, r));

        }
        return province;

    }*/

    getData = () =>{
         fetch('https://coronavirus-tracker-api.herokuapp.com/all')
             .then((response) => {
                 return response.json();
             })
             .then((data) => {
                 console.log(data);
                 this.setState({data})
             });
     }

    getCountries = () =>{
        fetch('https://gist.githubusercontent.com/erdem/8c7d26765831d0f9a8c62f02782ae00d/raw/248037cd701af0a4957cce340dabb0fd04e38f4c/countries.json')
            .then((response) => {
                return response.json();
            })
            .then((countriescoordinates) => {
                console.log(countriescoordinates);
                this.setState({countriescoordinates})
            });
    }
     componentDidMount() {
        this.getData();
        this.getCountries()
     }

    render () {
        const data=this.state.data;
        const countriescoordinates=this.state.countriescoordinates;
        return (
            <div className="App-map">
                <img src='1280px-Blue_Marble_2002.png' alt="map" width="1280" height="640"/>
                <svg className="App-point" width="100%" height="100%">
                {data != null && countriescoordinates!= null ? this.drawCircles() : <text> no data </text>}
                {/*data != null ? this.textCircles() : <text> no data </text>*/}
                </svg>
            </div>

            );
    }
}

export default App;


