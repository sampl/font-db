// https://stackoverflow.com/a/10727155/1061063
export const randomId = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const length = 10;
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};
