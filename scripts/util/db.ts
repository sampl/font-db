// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addRow = async (db: any, table: string, data: any) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => "?").join(", ");
  const query = `INSERT INTO ${table} (${keys.join(
    ", "
  )}) VALUES (${placeholders})`;
  await db.run(query, values);
};

export const updateRow = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  table: string,
  id: string,
  idField: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const query = `UPDATE ${table} SET ${keys
    .map((key) => `${key} = ?`)
    .join(", ")} WHERE ${idField} = ?`;
  await db.run(query, [...values, id]);
};

// export const insertOrUpdateRow = async ({
//   db,
//   table,
//   id,
//   idField,
//   data,
// }: {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   db: any;
//   table: string;
//   id: string;
//   idField: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   data: any;
// }) => {
//   const keys = Object.keys(data);
//   const values = Object.values(data);
//   const query = `INSERT OR REPLACE INTO ${table} (${keys.join(", ")})
//     VALUES (${keys.map(() => "?").join(", ")})
//     ON CONFLICT(${idField}) DO UPDATE SET
//       ${keys.map((key) => `${key} = excluded.${key}`).join(", ")}
//     WHERE ${table}.${idField} = excluded.${idField};`;
//   await db.run(query, [...values, id]);
// };
