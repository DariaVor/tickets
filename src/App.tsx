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
  const [filterStops, setFilterStops] = useState<number[]>([0, 1, 2, 3]);

  useEffect(() => {
    fetch("/tickets.json")
      .then((response) => response.json())
      .then((data) => setTickets(data.tickets));
  }, []);

  const toggleStopFilter = (stop: number) => {
    if (stop === -1) {
      setFilterStops([0, 1, 2, 3]);
    } else {
      setFilterStops((prev) =>
        prev.includes(stop) ? prev.filter((s) => s !== stop) : [...prev, stop]
      );
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStops.length === 4) return true;
    return filterStops.includes(ticket.stops);
  });

  const convertPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price * CURRENCY_RATES[currency]);
  };

  const parseDate = (date: string) => {
    const [day, month, year] = date.split(".").map(Number);
    return new Date(year + 2000, month - 1, day);
  };

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
