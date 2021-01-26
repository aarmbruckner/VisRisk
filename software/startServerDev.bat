REM set MONGO_URL=mongodb://localhost:27017/MeteorMongoDB
REM --once
set ROOT_URL=http://127.0.0.1:3000
set UNIVERSE_I18N_LOCALES = all
set TOOL_NODE_FLAGS: "--max_old_space_size=8192 --min_semi_space_size=8 --max_semi_space_size=256 --no-expose-gc --gc_interval=100"
set MAIL_URL=smtps://aarmbruckner@gmail.com:utsajokngqajliwc@smtp.gmail.com:465/
C:\Users\Alex\AppData\Local\.meteor\meteor.bat --settings settings.json 

 