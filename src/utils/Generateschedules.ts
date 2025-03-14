export const generateDepartureTimes = (startTime: string, endTime: string, frequency: number): string[] => {
  const times: string[] = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    times.push(currentTime);
    const [hour, minute] = currentTime.split(":").map(Number);
    const newHour = hour + frequency;
    currentTime = `${newHour % 24}:${minute.toString().padStart(2, "0")}`;
  }

  return times;
};