const stationNodes = {
  "North concourse": { main: 4, bridge: 3, ferry: 9, medical: 6 },
  "Platform bridge": { north: 3, main: 5, ferry: 4, platform: 2 },
  "Ferry gate": { bridge: 4, main: 7, parking: 5 },
  "Main entrance": { north: 4, bridge: 5, ferry: 7, parking: 3, medical: 4 },
  "Medical desk": { main: 4, north: 6, platform: 5 },
  "Platform lift": { bridge: 2, medical: 5, ferry: 6 },
  "Parking bay": { main: 3, ferry: 5 }
};

const aliases = {
  north: "North concourse",
  concourse: "North concourse",
  bridge: "Platform bridge",
  platform: "Platform lift",
  lift: "Platform lift",
  ferry: "Ferry gate",
  gate: "Ferry gate",
  main: "Main entrance",
  entrance: "Main entrance",
  parking: "Parking bay",
  taxi: "Parking bay",
  medical: "Medical desk",
  helpdesk: "Medical desk",
  wheelchair: "Medical desk"
};

const normalizeNode = (value = "") => {
  const text = value.toLowerCase();
  const match = Object.entries(aliases).find(([keyword]) => text.includes(keyword));
  return match ? match[1] : "Main entrance";
};

const findShortestPath = (start, end) => {
  const distances = Object.fromEntries(Object.keys(stationNodes).map((node) => [node, Infinity]));
  const previous = {};
  const unvisited = new Set(Object.keys(stationNodes));

  distances[start] = 0;

  while (unvisited.size) {
    const current = [...unvisited].sort((a, b) => distances[a] - distances[b])[0];
    unvisited.delete(current);

    if (current === end) {
      break;
    }

    Object.entries(stationNodes[current] || {}).forEach(([neighborAlias, minutes]) => {
      const neighbor = normalizeNode(neighborAlias);
      if (!unvisited.has(neighbor)) {
        return;
      }

      const nextDistance = distances[current] + minutes;
      if (nextDistance < distances[neighbor]) {
        distances[neighbor] = nextDistance;
        previous[neighbor] = current;
      }
    });
  }

  const path = [];
  let current = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path: path[0] === start ? path : [start, end],
    minutes: Number.isFinite(distances[end]) ? distances[end] : 8
  };
};

const buildOptimizedRoute = ({ vehicleBay, pickupPoint, dropPoint, mobilityPriority }) => {
  const start = normalizeNode(vehicleBay);
  const pickup = normalizeNode(pickupPoint);
  const drop = normalizeNode(dropPoint);
  const firstLeg = findShortestPath(start, pickup);
  const secondLeg = findShortestPath(pickup, drop);
  const combinedPath = [...firstLeg.path, ...secondLeg.path.slice(1)];
  const priorityBuffer = mobilityPriority === "critical" ? 1 : mobilityPriority === "priority" ? 2 : 4;
  const etaMinutes = Math.max(firstLeg.minutes - priorityBuffer, 1);
  const totalMinutes = Math.max(firstLeg.minutes + secondLeg.minutes - priorityBuffer, etaMinutes + 2);

  return {
    startNode: start,
    pickupNode: pickup,
    dropNode: drop,
    routeNodes: combinedPath,
    etaMinutes,
    totalMinutes,
    distanceScore: totalMinutes,
    routeSummary: combinedPath.join(" -> "),
    optimizationBasis: "Shortest accessible station path with priority buffer"
  };
};

module.exports = {
  buildOptimizedRoute
};
