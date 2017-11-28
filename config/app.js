var conf = {
    port: process.env.PORT || 8080,
    version: "1.01.25.1",
    debug: "on",
    enviroment: "development",
    pug : {
      pretty : true
    },
    sql : {
      userName: 'iglink',
      password: 'S1queloes!',
      server: 'iglink.database.windows.net',
      options: {encrypt: true, database: 'iglink',requestTimeout: 0}
    }
};

if(conf.enviroment == "production"){

};

module.exports = conf;
