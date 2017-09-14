

local db        = KEYS[1];
local front_id  = KEYS[2];

local open_time = ARGV[1];

-- 

redis.call('SELECT', db);

redis.call('HSET', 'prop::front::'.. front_id, 'open_time', open_time);

redis.call('SADD', 'set::front', front_id);

-- 

return 'OK';
