-- huangxin <3203317@qq.com>

local db         = KEYS[1];
local server_id  = KEYS[2];
local channel_id = KEYS[3];

-- 

redis.call('SELECT', db);

local user_id = redis.call('GET', server_id ..'::'.. channel_id);

if (false == user_id) then return 'invalid_user_id'; end;

-- 

local result = redis.call('HGETALL', 'prop::user::'.. user_id);

if (0 == #result) then return 'invalid_user_id'; end;

return result;
