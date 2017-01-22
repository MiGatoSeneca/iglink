var conf = {
    port: process.env.PORT || 8080,
    version: "1.01.22.2",
    debug: "on",
    enviroment: "development",
    pug : {
      pretty : true
    }
};

if(conf.enviroment == "production"){
};

module.exports = conf;
