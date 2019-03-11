import { Client } from "pg";
import { isEmpty } from 'lodash';
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
      await this.drop();
      await this.createTable();

      // await this.client.query('SELECT NOW()', (err, res) => {
      //   // console.log(err, res);
      //   this.client.end()
      // })
    } catch (error) {
      console.log(error);
    }
  }

  async createTable() {
    await this.entities.forEach(entity => {
      let tableName = entity.name;
      let keys = Object.keys(entity.meta().columns);
      let tableParams = keys.map((key) => {
        let value = entity.meta().columns[key];
        return `${key} ${value.generated ? " serial " : this.toPostgresType(value.type)} ${value.primary ? " primary key " : ""}`;
      }).join(', ');

      this.client.query(`create table if not exists ${tableName} (${tableParams})`)
      console.log(`create table if not exists ${tableName} (${tableParams})`)
    });
  }

  toPostgresType (value) {
    let types = {
      number: 'integer',
      string: 'varchar(255)'
    }
    if(types[value]) {
      return types[value];
    }
    console.log(`${value} is not accepted`);
  }

  async drop() {
    if(this.synchronize) {
      await this.entities.forEach(entity => {
        this.client.query(`drop table if exists ${entity.name.toLowerCase()}`)
      })
    }
  }

  async save (entity, data) {
    // INSERT INTO table_name(column_list) VALUES(value_list)
    // ON CONFLICT target action;
    let columns = Object.keys(data).join(', ');
    let values = Object.values(data).map(value => `'${value}'`).join(', ');
    console.log(`insert into ${entity.name} (${columns}) values (${values})`);
    try {
      let res = await this.client.query(`insert into ${entity.name} (${columns}) values (${values}) RETURNING *`)
      return res.rows[0];
    } catch (e) {
      console.log(`cannot insert into ${entity.name}`)
    }
  }

  async count (entity) {
    // SELECT COUNT(*) FROM table_name;
    try {
      console.log(`select count(*) from ${entity.name.toLowerCase()}`)
      let res = await this.client.query(`select count(*) from ${entity.name.toLowerCase()}`);
      return res.rows[0].count;
    } catch (e) {
      console.log(`cannot count ${entity.name} -- ${e}`);
    }
  }

  async findByPk(entity, id, attributes ) {
    // select attributes from table_name where id = id
    try {
      let keys = Object.keys(entity.columns);
      let pk = keys.map((key) => {
        if (key.primary) {
          return key;
        } else {
          return
        }
      }).join('and ');

      if (isEmpty(id)) {
        throw new Error(`need an ID for this function`)
      }
      
      if (attributes.length == 0) {
        let columns = '*'
      } else {
        let columns = attributes.join(', ')
      }
      let res = await this.client.query(`select ${columns} from ${entity.name} where ${pk}=${id}`);
      return res.rows[0]
    } catch (e) {
      console.log(`cannot selectById ${entity.name} -- ${e}`);
    }
  }

  async findAll(entity, attributes) {
    // select attributes from table_name
    try {
      if (attributes.length == 0) {
        let columns = '*'
      } else {
        let columns = attributes.join(', ')
      }
      let res = await this.client.query(`select ${columns} from ${entity.name}`);
      return res.rows;
    } catch (e) {
      console.log(`cannot findAll ${entity.name} -- ${e}`);
    }
  }

  async findOne(entity, data){
    // select attributes from table_name where columns=values
    let columns = data.attributes.join(', ')
    try {

      let keys = Object.keys(data.where);
      let values = keys.map((key) => {
        let value = data.where[key];
        return `${key}='${value}'`;
      }).join('and ');
      // console.log(`select ${columns} from ${entity.name.toLowerCase()} where ${values}`)
      let res = await this.client.query(`select ${columns} from ${entity.name} ${ isEmpty(values)? '' :  'where' } ${values}`)
      return res.rows[0]
    } catch (e) {
      console.log(`cannot findOne ${entity.name} -- ${e}`);
    }
  }

  async update(entity, data) {
    // update table_name set columns = new_value where columns = values
    try {
      let keys = Object.keys(data.changes);
      let values = keys.map((key) => {
        let value = data.changes[key];
        return `${key}='${value}'`;
      }).join(', ');

      let keysWhere = Object.keys(data.where);
      let valuesWhere = keysWhere.map((keyWhere) => {
        let valueWhere = data.where[keyWhere];
        return `${keyWhere}='${valueWhere}'`;
      }).join('and ');

      let res = await this.client.query(`update ${entity.name} set ${values} where ${valuesWhere} returning *`)
      return res.rows[0];
    } catch (e) {
      console.log(`cannot update ${entity.name} -- ${e}`);
    }
  }

  async remove(entity, data) {
    // delete from table_name where columns = values 
    try {
      console.log(data)
      let keys = Object.keys(data);
      let values = keys.map((key) => {
        let value = data[key];
        return `${key}='${value}'`;
      }).join('and ');
      await this.client.query(`delete from ${entity.name} where ${values}`)
    } catch (e) {
      console.log(`cannot remove ${entity.name} -- ${e}`);
    }
  }
}