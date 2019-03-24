import React, { Component } from 'react';
import moment from 'moment';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import '../styles/Main.css';
import SearchBox from './SearchBox';
import store from "../store";
import FlightCard from '../components/FlightCard';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: { min: 0, max: 20000 },
    }
  }

  render() {
    const state = store.getState();
    const { initial, flights, mode, query } = state;
    return (
      <div>
        <div className={initial? "Main": "Main small"}></div>
        <SearchBox position={initial? '': 'top'}/>
        { !initial &&
        <div className="result-container">
          <div className="seperator">
            {/* <div className="right padd">
              <div>Departure: {moment(query.dept).format("DD-MM-YYYY")}</div><br></br>
              {
                flights[] && 
                <div>Return: {moment(query.return).format("DD-MM-YYYY")}</div>
              }
            </div> */}
            <div className="price-slider">
              <div className="symbol">₹ </div>
              <InputRange
                maxValue={20000}
                minValue={0}
                step={100}
                value={this.state.price}
                onChange={price => this.setState({ price })} />
            </div>
          </div>
          {
            flights
              .filter(flight => {
                let price = flight.price;
                if (flight.returnData) {
                  price += flight.returnData.price;
                }
                return price >= this.state.price.min && price <= this.state.price.max;
              })
              .map(flight => {
                let { departure, arrival, returnData } = flight;
                let durationH = moment(arrival).diff(moment(departure), 'hours');
                durationH = Math.floor(durationH);
                let durationM = moment(arrival).diff(moment(departure), 'minutes') % 60;
                let duration = durationH + 'h ' + durationM + 'm';
                departure = moment(departure).format("hh:mm A");
                arrival = moment(arrival).format("hh:mm A");
                let data = {
                  id: flight.id,
                  from: flight.from,
                  to: flight.to,
                  departure,
                  arrival,
                  duration,
                  price: flight.price
                }

                if (returnData) {
                  let durationH = moment(returnData.arrival).diff(moment(returnData.departure), 'hours');
                  durationH = Math.floor(durationH);
                  let durationM = moment(returnData.arrival).diff(moment(returnData.departure), 'minutes') % 60;
                  let duration = durationH + 'h ' + durationM + 'm';
                  returnData = {
                    id: returnData.id,
                    from: returnData.from,
                    to: returnData.to,
                    departure: moment(returnData.departure).format("hh:mm A"),
                    arrival: moment(returnData.arrival).format("hh:mm A"),
                    duration,
                    price: returnData.price
                  };
                } else {
                  returnData = null;
                }

                
                return (<FlightCard data={data} returnData={returnData}/>)
              })
          }
        </div>}
      </div>
    );
  }
}

export default Main;
