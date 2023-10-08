import { createPool } from "mysql2/promise";

export async function connect() {
  const connection = await createPool({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "db_test_is1",
    connectionLimit: 10,
  });

  return connection;
}
