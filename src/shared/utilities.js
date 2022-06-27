export const getNearest = (slots, entry) => {
  return slots
    .filter((slot) => slot.isOccupied === false)
    .filter((slot) => slot.distance[entry] !== undefined)
    .sort((a, b) => a.distance[entry] - b.distance[entry])[0];
};

export const getRank = (slots, entry, id) => {
  console.log(slots[0].distance[3]);
  return slots
    .filter((slot) => slot.isOccupied === false)
    .filter((slot) => slot.distance[entry] !== undefined)
    .sort((a, b) => a.distance[entry] - b.distance[entry])
    .findIndex((slot) => slot.id === id);
};

export const getSizeText = (size) => {
  switch (size) {
    case 0:
      return "Small";
    case 1:
      return "Medium";
    case 2:
      return "Large";
    default:
      return;
  }
};

export const getAvailableSizes = (slots, size) => {
  return slots.filter((slot) => slot.size >= size && slot.isOccupied === false);
};

export const parkingFeeDict = {
  0: 20,
  1: 60,
  2: 100,
};

export const isReturnee = (vehicle) => {
  if (!vehicle.lastParkOut) return false;

  const lastTimeOut = new Date(vehicle.lastParkOut);
  const timeIn = new Date(vehicle.parkIn);

  const hours = parseInt(
    (Math.abs(timeIn - lastTimeOut) / (1000 * 60 * 60)) % 24
  );
  if (hours > 1) return false;
  else return true;
};

export const calculateFee = (vehicle) => {
  var fee = 0;
  const timeIn = new Date(vehicle.parkIn);

  const timeOut = new Date();
  const days = parseInt((timeOut - timeIn) / (1000 * 60 * 60 * 24));
  var hours = parseInt((Math.abs(timeOut - timeIn) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt(
    (Math.abs(timeOut.getTime() - timeIn.getTime()) / (1000 * 60)) % 60
  );
  const seconds = parseInt(
    (Math.abs(timeOut.getTime() - timeIn.getTime()) / 1000) % 60
  );

  if (minutes > 0 || seconds > 0) {
    hours += 1;
  }

  const returnee = isReturnee(vehicle);

  if (returnee) {
    const timeLeft = 3 - vehicle.timeConsumed.hours;
    if (timeLeft > 0) {
      if (hours > timeLeft) fee += (hours - timeLeft) * vehicle.parkingFee;
    } else {
      fee += hours * vehicle.parkingFee;
    }
  } else {
    fee += 40;
    if (days > 0) {
      fee += 5000;
    }
    if (hours > 3) {
      fee += (hours - 3) * vehicle.parkingFee;
    }
  }
  return { returnee, days, hours, minutes, seconds, fee };
};

export const hasRecord = (vehicles, plate) => {
  return vehicles.find((vehicle) => vehicle.plate === plate);
};
