REM --once
set ROOT_URL=http://127.0.0.1:3000
set UNIVERSE_I18N_LOCALES = all
set MONGO_URL=mongodb://localhost:27017/meteor2
set TOOL_NODE_FLAGS: "--max_old_space_size=8192 --min_semi_space_size=8 --max_semi_space_size=256 --no-expose-gc --gc_interval=100"
#add own mail url
set MAIL_URL=
%userprofile%\AppData\Local\.meteor\meteor.bat --inspect --settings settings.json --no-release-check --exclude-archs web.browser.legacy,web.cordova

 