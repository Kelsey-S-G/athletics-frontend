import { ticketsData } from "../data/Data";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Tickets = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-gray-200">
      <div className="space-y-6">
        {ticketsData.map((ticket) => (
          <Card
            key={ticket.id}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="flex flex-col md:flex-row justify-between p-6 gap-6">
              <div className="flex flex-col md:flex-row gap-6 flex-grow">
                <div className="relative w-full md:w-64 h-64 flex-shrink-0">
                  <img
                    src={ticket.image}
                    alt={ticket.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-800/20 to-transparent rounded-lg" />
                </div>

                <div className="space-y-4 flex-grow">
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="px-4 py-1.5 bg-red-800 text-white rounded-full font-bold">
                      GHC {ticket.price}
                    </span>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      {ticket.eventDate}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    {ticket.title}
                  </h2>
                  <p className="text-gray-600 italic">{ticket.descr}</p>
                </div>
              </div>

              <div className="flex items-center">
                <button className="w-full md:w-auto px-6 py-3 bg-red-800 hover:bg-red-900 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  Buy Tickets
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Tickets;
