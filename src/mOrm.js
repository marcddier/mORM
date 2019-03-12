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

    // console.log(dbConfig.entities[0].meta());

    this.config.synchronise = dbConfig.synchronise;
    this.config.entities = dbConfig.entities;
    this.entities = {};

    this.config.entities.forEach(element => {
    this.entities[element.name] = element; 
    });

    // console.log(this.entities)

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

    await this.dbInstance.initialize();
  }

  getEntity(name) {
    for(let entity in this.entities){
      if (entity.toLowerCase() == name.toLowerCase()) {
        return new this.entities[entity](this.dbInstance, name);
      }
    }
    throw new Error(`Table called ${name} doesn't exist`);
  }
}