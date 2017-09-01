npm install \
&& npm install ../db/ \
&& npm install ../lib/ \
&& npm install ../cfg/ \
&& npm install ../model/ \
&& npm install ../biz/ \
&& export ACTIVEMQ_PORT=61613 \
&& export MYSQL_PORT=12306 \
&& export MYSQL_PASS=123456 \
&& export REDIS_PORT=12379 \
&& pm2 start app.js --name login
