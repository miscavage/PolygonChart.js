const generateRandomData = (count, len) => {
  const data = [];
  for (let a = 0; a < count; a++) {
    const point = [];
    for (let b = 0; b < len; b++) {
      point.push(Math.random());
    }
    data.push(point);
  }

  return data;
}
