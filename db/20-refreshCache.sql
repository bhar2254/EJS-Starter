DELETE FROM cache
WHERE update_time < NOW() - INTERVAL 24 HOUR
AND id > 0;