import { Client } from "pg";
import Core from './core'

export default class PostgreSQL extends Core {
  // ...
  constructor (options) {
    super(options); // obj pour init avec l'autre consructor
  }

  async initialize() {
    const {host, port, username, password, database} = this;


    // console.log(this);

    this.client = new Client({
      user: username,
      host,
      port,
      database,
      password
    });

    try {
      await this.client.connect();

      this.client.query('SELECT NOW()', (err, res) => {
        // console.log(err, res);
        this.client.end()
      })
    } catch (error) {
      console.log(`Error: ${database} doesn't exist`);
    }
  }
}