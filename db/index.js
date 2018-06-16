const { Pool, Client } = require('pg');
//导入数据库配置信息
const dbConfig = require('../config/index');
const secrets = dbConfig.secrets;
//授权
const auth = require('../authentication/auth');


//连接数据库
const pool = new Pool({
    user: secrets.user,
    host: secrets.host,
    database: secrets.database,
    password: secrets.password,
    port: secrets.port,
  });
  
  //请求数据
  pool.query('SELECT * from test')
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
      };

      pool.query(query)
        .then(res => console.log(res.rows[0]))
        .catch(e => console.error(e.stack));

    }

    //获取用户名和密码
    const findByUsername = function(userame, cb) {
      const query = {
        text: "select * from users where username = $1",
        values: [userame]
      };

      pool.query(query)
        .then(res => {
          const rows = res.rows;
          if(rows.length>0) {
            cb(null, res.rows[0]);
          } else {
            const noUserError = new Error('Use does not exist!')
            cb(noUserError,null);
          }
        })
        .catch(e => console.log(e.stack));
    }

exports.addUser = addUser;
exports.findByUsername = findByUsername;