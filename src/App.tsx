import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("/tickets.json")
      .then((response) => response.json())
      .then((data) => setTickets(data.tickets));
  }, []);

  return <>
  <div>
    <h1>Билеты</h1>
    {tickets.map((ticket) => (
      <div key={ticket.id}>
        <img src={`/logos/${ticket.carrier}.svg`}/>
        <button>Купить за {ticket.price}₽</button>
        <p>{ticket.departure_time}</p>
        <p>{ticket.origin}, {ticket.origin_name}</p>
        <p>{ticket.departure_date}</p>
        <p>{ticket.stops} пересадка</p> 
        <p>{ticket.arrival_time}</p>
        <p>{ticket.destination_name}, {ticket.destination}</p>
        <p>{ticket.departure_date}</p>
      </div>
    ))}
  </div>
  </>;
}

export default App;
