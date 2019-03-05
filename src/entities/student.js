import Entity from './entity';

export default class Student extends Entity{
  static meta() {
    return {
      name: "Stgerg kzhfiuhifhudent",
      columns: {
        id: {
          primary: true,
          type: "number",
          generated: true
        },
        firstname: {
          type: "string"
        },
        lastname: {
          type: "string"
        },
        age: {
          type: "number"
        }
      }
    };
  }
}