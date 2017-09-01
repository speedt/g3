-- huangxin <3203317@qq.com>

local db      = KEYS[1];
local user_id = KEYS[2];

-- 

redis.call('SELECT', db);

local result = redis.call('HGETALL', 'prop::user::'.. user_id);

if (0 == #result) then return 'invalid_user_id'; end;

return result;
