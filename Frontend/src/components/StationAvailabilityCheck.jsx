import React, { useState } from "react";
import { ArrowRight, CheckCircle, Search, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const availableStations = [
  { name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)", code: "CSMT", city: "Mumbai" },
  { name: "Dadar Railway Station", code: "DR", city: "Mumbai" },
  { name: "Lokmanya Tilak Terminus (LTT)", code: "LTT", city: "Mumbai" },
  { name: "Pune Junction", code: "PUNE", city: "Pune" },
  { name: "Nagpur Junction", code: "NGP", city: "Nagpur" },
  { name: "Nashik Road Railway Station", code: "NK", city: "Nashik" },
  { name: "Thane Railway Station", code: "TNA", city: "Thane" },
  { name: "Kolhapur (Chhatrapati Shahu Maharaj Terminus)", code: "KOP", city: "Kolhapur" },
  { name: "Aurangabad Railway Station", code: "AWB", city: "Aurangabad" },
  { name: "Solapur Junction", code: "SUR", city: "Solapur" }
];

const StationAvailabilityCheck = () => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const filteredStations = availableStations.filter((station) =>
    [station.name, station.code, station.city].some((value) =>
      value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const selectedStationDetails = availableStations.find(
    (station) => station.code === selectedStation
  );

  const handleStationSelect = (stationCode) => {
    setSelectedStation(stationCode);
    setSearchQuery("");
    setIsChecked(false);
  };

  return (
    <div className="w-full rounded-lg border border-slate-700 bg-slate-800/70 p-6 shadow-xl backdrop-blur-sm">
      <h2 className="mb-2 text-center text-2xl font-semibold text-blue-400">
        Check Your Station
      </h2>
      <p className="mb-6 text-center text-sm text-gray-400">
        See if RailAid services are available at your station.
      </p>

      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search station name or code..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setIsChecked(false);
            }}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {searchQuery && filteredStations.length > 0 && (
          <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-600 bg-slate-900 shadow-xl">
            {filteredStations.map((station) => (
              <button
                key={station.code}
                onClick={() => handleStationSelect(station.code)}
                className="w-full border-b border-slate-700 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-800"
              >
                <p className="text-sm font-medium text-white">{station.name}</p>
                <p className="text-xs text-gray-400">
                  {station.code} - {station.city}
                </p>
              </button>
            ))}
          </div>
        )}

        {searchQuery && filteredStations.length === 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 p-4 shadow-xl">
            <p className="text-center text-sm text-gray-400">No stations found.</p>
          </div>
        )}
      </div>

      {selectedStationDetails && !searchQuery && (
        <div className="mb-4 rounded-lg border border-blue-500 bg-blue-600/20 p-3">
          <p className="mb-1 text-xs text-gray-300">Selected station</p>
          <p className="text-sm font-semibold text-blue-400">
            {selectedStationDetails.name}
          </p>
        </div>
      )}

      {selectedStation && !isChecked && (
        <button
          onClick={() => setIsChecked(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold transition-all duration-200 hover:bg-blue-700"
        >
          <Search className="h-5 w-5" />
          Check Availability
        </button>
      )}

      {isChecked && selectedStationDetails && (
        <div>
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-green-500 bg-green-600/20 p-4">
            <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400" />
            <div>
              <p className="font-semibold text-green-400">Service Available</p>
              <p className="text-xs text-gray-300">
                RailAid services are active at this station.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/booking")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold transition-all duration-200 hover:bg-blue-700"
          >
            Book Your Slot
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {isChecked && !selectedStationDetails && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500 bg-red-600/20 p-4">
          <XCircle className="h-6 w-6 flex-shrink-0 text-red-400" />
          <div>
            <p className="font-semibold text-red-400">Service Not Available</p>
            <p className="text-xs text-gray-300">
              Please select a valid station from the list.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Currently available at {availableStations.length} major stations in Maharashtra.
        </p>
      </div>
    </div>
  );
};

export default StationAvailabilityCheck;
