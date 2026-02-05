-- Topics
INSERT INTO topics (id, title, description, difficulty_level) VALUES
('11111111-1111-1111-1111-111111111111', 'Business Email Writing', 'Learn how to write professional emails for job applications and daily work.', 'BEGINNER'),
('22222222-2222-2222-2222-222222222222', 'Effective Presentations', 'Master the art of public speaking and slide design.', 'INTERMEDIATE'),
('33333333-3333-3333-3333-333333333333', 'Negotiation Skills', 'Advanced vocabulary and tactics for business deals.', 'ADVANCED')
ON CONFLICT (id) DO NOTHING;

-- Lessons for "Business Email Writing"
INSERT INTO lessons (id, topic_id, title, content_body, order_index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Formal vs Informal Greetings', '<h3>Understanding the Context</h3><p>In business, knowing when to use ''Dear Mr. Smith'' versus ''Hi John'' is crucial...</p>', 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Structuring a Request', '<h3>The 3-Part Structure</h3><p>1. The Opening<br>2. The Reason<br>3. The Call to Action</p>', 2)
ON CONFLICT (id) DO NOTHING;

-- Lessons for "Effective Presentations"
INSERT INTO lessons (id, topic_id, title, content_body, order_index) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Opening with a Hook', '<h3>Grab Their Attention</h3><p>Start with a surprising statistic, a quote, or a story.</p>', 1)
ON CONFLICT (id) DO NOTHING;
