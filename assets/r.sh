/root/my/activemq/apache-activemq-5.14.4/bin/activemq start \
&& /root/my/redis/redis-3.2.6/src/redis-server /root/my/redis/redis-3.2.6/redis.conf \
&& /root/my/git/speedt/g3/assets/redis/r.sh \
&& /usr/local/nginx/sbin/nginx -c /root/my/git/speedt/g3/front/nginx.conf