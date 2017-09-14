

local db = KEYS[1];

redis.call('SELECT', db);

return redis.call('SMEMBERS', 'set::front');
