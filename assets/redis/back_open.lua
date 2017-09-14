

local db        = KEYS[1];
local back_id   = KEYS[2];

local open_time = ARGV[1];

-- 

redis.call('SELECT', db);

redis.call('HSET', 'prop::back::'.. back_id, 'open_time', open_time);

redis.call('SADD', 'set::back', back_id);

-- 

return 'OK';
