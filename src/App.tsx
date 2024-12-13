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
    <div className="min-h-screen bg-sky-50 flex flex-col lg:flex-row gap-8 py-8 px-4 lg:px-16">
      <aside className="bg-white shadow-lg rounded-lg p-6 w-full h-fit lg:w-1/4">
        <h3 className="text-lg text-gray-600 mb-4 font-normal uppercase">
          Валюта
        </h3>
        <div className="flex gap-2 mb-6">
          {["RUB", "USD", "EUR"].map((cur) => (
            <button
              key={cur}
              className={`w-full py-2 rounded-lg border ${
                currency === cur
                  ? "bg-sky-500 text-white"
                  : "border-sky-500 text-sky-500 hover:bg-sky-100"
              }`}
              onClick={() => setCurrency(cur as "RUB" | "USD" | "EUR")}
            >
              {cur}
            </button>
          ))}
        </div>

        <h3 className="text-lg text-gray-600 mb-4 font-normal uppercase">
          Количество пересадок
        </h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer text-gray-600 font-normal">
            <input
              type="checkbox"
              checked={filterStops.length === 4}
              onChange={() => toggleStopFilter(-1)}
              className="appearance-none h-5 w-5 rounded border border-gray-300 checked:bg-sky-500 checked:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 mr-2"
            />
            Все
          </label>
          {[0, 1, 2, 3].map((stop) => (
            <label
              key={stop}
              className="flex items-center cursor-pointer text-gray-600 font-normal"
            >
              <input
                type="checkbox"
                checked={filterStops.includes(stop)}
                onChange={() => toggleStopFilter(stop)}
                className="appearance-none h-5 w-5 rounded border border-gray-300 checked:bg-sky-500 checked:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 mr-2"
              />
              {stop === 0
                ? "Без пересадок"
                : `${stop} пересадк${stop > 1 ? "и" : "а"}`}
            </label>
          ))}
        </div>
      </aside>

      <main className="flex-1 grid grid-cols-1 gap-6">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-row items-center justify-between min-h-[200px]"
          >
            <div className="flex flex-col items-center justify-between w-1/4">
              <img
                src={`/logos/${ticket.carrier}.svg`}
                alt={ticket.carrier}
                className="w-20 h-12 mb-4"
              />
              <button className="py-2 px-4 rounded-lg bg-orange-600 text-white font-normal hover:bg-orange-500">
                Купить за {convertPrice(ticket.price)}
              </button>
            </div>

            <div className="border-l border-gray-200 mx-6 h-full"></div>

            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-center mb-4">
                <div className="text-gray-600 text-4xl font-normal">
                  {ticket.departure_time}
                </div>
                <div className="text-xs font-normal text-gray-500 uppercase">
                  {ticket.stops === 0
                    ? "Без пересадок"
                    : `${ticket.stops} пересадк${ticket.stops > 1 ? "и" : "а"}`}
                </div>
                <div className="text-gray-600 text-4xl font-normal">
                  {ticket.arrival_time}
                </div>
              </div>

              <div className="flex justify-between text-gray-700 text-sm mb-2">
                <p>
                  {ticket.origin}, {ticket.origin_name}
                </p>
                <p>
                  {ticket.destination_name}, {ticket.destination}
                </p>
              </div>

              <div className="flex justify-between text-gray-500 text-sm">
                <p>
                  {parseDate(ticket.departure_date).toLocaleDateString(
                    "ru-RU",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>
                <p>
                  {parseDate(ticket.arrival_date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
