

local db       = KEYS[1];
local front_id = KEYS[2];

-- 

redis.call('SELECT', db);

redis.call('DEL', 'prop::front::'.. front_id);

redis.call('SREM', 'set::front', front_id);

-- 

return 'OK';
