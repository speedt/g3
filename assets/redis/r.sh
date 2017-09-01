#!/bin/bash

echo "authorize.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/authorize.lua)"

echo ""
echo "token.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/token.lua)"

echo ""
echo "channel_close.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/channel_close.lua)"

echo ""
echo "user_info_byChannelId.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/user_info_byChannelId.lua)"

# 

echo ""
echo "back_open.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/back_open.lua)"

echo ""
echo "back_close.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/back_close.lua)"

echo ""
echo "back_list.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/back_list.lua)"

# 

echo ""
echo "front_open.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/front_open.lua)"

echo ""
echo "front_close.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/front_close.lua)"

echo ""
echo "front_list.lua"
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 script load "$(cat /root/my/git/speedt/g2/assets/redis/front_list.lua)"

# 

echo ""
/root/my/redis/redis-3.2.6/src/redis-cli -a 123456 --eval /root/my/git/speedt/g2/assets/redis/init.lua 1 ,
