var path = require("path");　　//環境に依存しないようにするため？
var ROOT = path.join(__dirname, "../");  //ロートディレクトリの絶対パスを取得

module.exports = {
  appenders: {
    ConsoleLogAppender: {
      type: "console"
    },
    FileLogAppender: {
      type: "file",
      filename: path.join(ROOT, "./log/system/system.log"),
      maxLogSize: 5000000,
      bakups: 10
    },
    MultiFileLogAppender: {
      type: "multiFile",
      base: path.join(ROOT, "./log/application/"),
      property: "key",
      extension: ".log"
    },
    DateRollingFileLogAppeder: {
      type: "dateFile",
      filename: path.join(ROOT, "./log/access/access.log"),
      pattern: "-yyyyMMdd",
      daysToKeep: 30
    }
  },
  categories: {
    "default": {
      appenders: ["ConsoleLogAppender"],
      level: "ALL"
    },
    system: {
      appenders: ["FileLogAppender"],
      level: "ERROR"
    },
    application: {
      appenders: ["MultiFileLogAppender"],
      level: "ERROR"
    },
    access: {
      appenders: ["DateRollingFileLogAppeder"],
      level: "INFO"
    }
  }
}