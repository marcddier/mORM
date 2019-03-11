export default class Entity{
  constructor(dbInstance, name) {
    this.dbInstance = dbInstance,
    this.name = name
  }

  async save(data) {
    return await this.dbInstance.save(this, data);
  }
  async count() {
    return await this.dbInstance.count(this);
  }
  async findByPk(id, attributes) {
    return await this.dbInstance.findByPk(this, id, attributes)
  }
  async findAll(attributes) {
    return await this.dbInstance.findAll(this, attributes)
  }
  async findOne(data) {
    return await this.dbInstance.findOne(this, data)
  }
  async update(data) {
    return await this.dbInstance.update(this, data)
  }
  async remove(data) {
    return await this.dbInstance.remove(this, data)
  }

}