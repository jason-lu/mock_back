const { Pool, Client } = require('pg');
//导入数据库配置信息
const dbConfig = require('../config/index');
const secrets = dbConfig.secrets;


//连接数据库
const pool = new Pool({
    user: secrets.user,
    host: secrets.host,
    database: secrets.database,
    password: secrets.password,
    port: secrets.port,
  });
  
  //请求数据
  pool.query('SELECT * from replica_test')
    .then(res => {
      console.log(res.rows[0]);
    })
    .catch(e =>  {
      console.log(e.stack);
    });


    const addUser = function(user, email, password) {
      const query = {
        text: 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *',
        values: [user, email,password]
      }

      pool.query(query)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack));

    }

exports.addUser = addUser;