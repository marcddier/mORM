import { isEmpty } from 'lodash';
import { existsSync } from 'fs';
import path from 'path';
import PostgreSQL from './engine/postgresql';

export default class mOrm {
  configPathName = "./mrom.config.json";

  async createConnection(dbConfig = {}) {
    // checking configuration
    if(isEmpty(dbConfig)) {
      if(!existsSync(path.join(__dirname, this.configPathName))) {
        throw new Error ("Configuration file mOrm.config.json required")
      }
      this.config = require(this.configPathName);
    } else {
      if(dbConfig.uri) {
        // "uri": "postgres://marc:marc@localhost:5432/iLovePragmatic"
        const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/g;

        const [, type, username, password, host, port, database] = regExp.exec(dbConfig.uri);
        const synchronise = dbConfig.synchronise;
        const entities = dbConfig.entities;

        this.config = {
          type,
          username,
          password,
          host,
          port,
          database,
          synchronise,
          entities
        }
      } else {
        this.config = dbConfig;
      }
    }
    // console.log(this.config)

    // instanciate DB engine
    switch (this.config.type) {
      case 'postgres':
        this.dbInstance = new PostgreSQL(this.config);
        break;
      case 'mysql':
        this.dbInstance = new MySQL(this.config);
        break;

      default:
        throw new Error (`Engine ${this.config.type} not supported `);
        break;
    }

    console.log(this.config.entities);
    // console.log(this.config.entities[0]);
    // console.log(this.config.entities[0].name);
    // console.log(this.config.entities[0].columns);
    // console.log(typeof this.config.entities[0]);
    
    

    // this.config.entities.forEach(element => {
    //   console.log(element.)
    // });

    await this.dbInstance.initialize();
  }
}