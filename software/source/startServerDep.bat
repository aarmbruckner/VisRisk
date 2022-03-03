set MONGO_URL=mongodb://localhost:27017/RiskEstimationRecorder
set ROOT_URL=http://127.0.0.1:3000
set UNIVERSE_I18N_LOCALES = all
#add own mail url
set MAIL_URL=
set METEOR_SETTINGS= { "public": { "appInfo": { "version" : "1.0", "serverUrl":"http://127.0.0.1:3000", "httpsServerUrl":"https://127.0.0.1:3430", "httpsPort":3430, "httpPort":3000 }, "mail": { "tokenMailAdress":"riskestimationrecorder@riskest.com" }, "storage": { "//":"allowed values are MONGODB and LOCALSTORAGE", "storageProvider":"MONGODB" }, "logo": { "logoLocation":"img/logo.png", "logoWidth":162, "logoHeight":30 }, "logging":{ "logFileDirectory": ".\\log" }, "localisation": { "i18nLanguage" : "en-Us", "localTimeZoneOffset":2 }, "graphEditor": { "editorTemplate":"graphTemplates/editorTemplate.xml" }, "surveyEditor": { "clearGraphAfterLogSave": false }, "defaultGraphConfigurations": { "calcConfig": { "opinionPooling": { "decimalPointAccuracy":5, "epsilon":0.1 }, "dataCorrection": { "pX":0.2, "pY":0.2, "manualDeltaEnabled":false, "deltaXLow":0.1, "deltaXHigh":0.1, "deltaYLow":0.1, "deltaYHigh":0.1 } } } } }
set PORT=3000
node main.js --max_old_space_size=4096 --min_semi_space_size=8 --max_semi_space_size=256 --no-expose-gc --gc_interval=100