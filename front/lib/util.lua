-- huangxin <3203317@qq.com>

local _M = {};

function _M.trim(s)
  return (string.gsub(s, "^%s*(.-)%s*$", "%1"));
end;



--[[
判断字符串是否为空
--]]
function _M:isEmpty(s)
  if nil == s then return nil; end;

  s = self.trim(s);

--  if '' == s then
--    return nil;
--  else
--    return s;
--  end;

  return ('' ~= s and s) or nil;
end;



return _M;

