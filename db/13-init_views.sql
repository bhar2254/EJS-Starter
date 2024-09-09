DROP VIEW IF EXISTS viewPosts;
CREATE VIEW viewPosts AS
	SELECT posts.*, users.name
    FROM posts
    LEFT OUTER JOIN users ON users.id = posts.author_id; 
    
    