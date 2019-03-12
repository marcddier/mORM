import mOrm from './mOrm';
import Student from './entities/student'

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "20180221",
      password: "",
      database: "iLovePragmatic",
      synchronize: false,
      entities: [
        Student
      ]
    });
    // or:
    // orm.createConnection({ uri: 'postgresql://20180221:@localhost:5432/iLovePragmatic'

    let student = {
      firstname: 'Dora',
      lastname: 'Lexploratrice'
    }
    
    const studentEntity = orm.getEntity('Student')
    const saved = await studentEntity.save(student)
    // console.log(`New student ${saved.firstname}`)

    const countStudent = await studentEntity.count();
    // console.log(`we have ${countStudent} students`);

    const findId = await studentEntity.findByPk(1, ['firstname', 'lastname']);
    // console.log(`the first id is :${findId.lastname} ${findId.firstname}`);

    const all = await studentEntity.findAll(['firstname', 'lastname']);
    // console.log(`All ---${all}`);

    const one = await studentEntity.findOne({attributes: ['firstname', 'lastname'], where: {firstname : 'Dora', lastname: 'Lexploratrice'}});
    // console.log(`One ---${one}`);

    const update = await studentEntity.update({changes: {firstname: 'Dora', lastname: 'Lexploratrice'}, where: {id : 7}})
    // console.log(update);

    // await studentEntity.remove({firstname: 'Dora', lastname: 'Lexploratrice'})

  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
})();