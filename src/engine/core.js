export default class Core {
  constructor({ host, port, username, password, database, synchronize, entities }) {
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.database = database
    this.synchronize = synchronize
    this.entities = entities
  }
  dump() {
    console.log(`Database infos: 
    host: ${this.host} 
    port: ${this.port} 
    username: ${this.username} 
    password: ${this.password} 
    database: ${this.database} 
    `)
  }
}