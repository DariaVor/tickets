import { useEffect, useState } from "react";

type Ticket = {
  id: number;
  origin: string;
  origin_name: string;
  destination: string;
  destination_name: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  carrier: string;
  stops: number;
  price: number;
};

const CURRENCY_RATES = { USD: 0.013, EUR: 0.012, RUB: 1 };

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currency, setCurrency] = useState<"RUB" | "USD" | "EUR">("RUB");

  useEffect(() => {
    fetch("/tickets.json")
      .then((response) => response.json())
      .then((data) => setTickets(data.tickets));
  }, []);

  return (
    <>
      <div>
        <h1>Билеты</h1>
        {tickets.map((ticket) => (
          <div key={ticket.id}>
            <img src={`/logos/${ticket.carrier}.svg`} />
            <button>Купить за {ticket.price}₽</button>
            <p>{ticket.departure_time}</p>
            <p>
              {ticket.origin}, {ticket.origin_name}
            </p>
            <p>{ticket.departure_date}</p>
            <p>{ticket.stops} пересадка</p>
            <p>{ticket.arrival_time}</p>
            <p>
              {ticket.destination_name}, {ticket.destination}
            </p>
            <p>{ticket.departure_date}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
