

local db      = KEYS[1];
local back_id = KEYS[2];

-- 

redis.call('SELECT', db);

redis.call('DEL', 'prop::back::'.. back_id);

redis.call('SREM', 'set::back', back_id);

-- 

return 'OK';
