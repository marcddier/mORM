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
      synchronize: "true",
      entities: [
        Student
      ]
    });

    // or:
    // orm.createConnection({ uri: 'postgresql://20180221:@localhost:5432/iLovePragmatic'
  } catch (error) {
    console.log(error);
    process.exit(-1);
  }
})();