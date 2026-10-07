-- Insert base skills
INSERT INTO skills (name, category) VALUES 
('React', 'Frontend'),
('Next.js', 'Frontend'),
('TypeScript', 'Language'),
('Node.js', 'Backend'),
('PostgreSQL', 'Database'),
('Supabase', 'Database'),
('Tailwind CSS', 'Frontend'),
('Python', 'Language'),
('Java', 'Language'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Git', 'Tools'),
('Figma', 'Design'),
('Machine Learning', 'AI'),
('Data Analysis', 'Data')
ON CONFLICT (name) DO NOTHING;

-- Since auth.users is managed by Supabase Auth, creating users directly in SQL for seeding 
-- requires inserting into auth.users. For a complete seed script, we simulate this or 
-- rely on the app to create users. 
-- Assuming we have 1 mock company to start:
INSERT INTO companies (id, name, website, verified) VALUES 
('c0000000-0000-0000-0000-000000000001', 'TechFlow India', 'https://techflow.in', true)
ON CONFLICT DO NOTHING;

-- And 1 job
INSERT INTO jobs (id, company_id, title, description, type, mode, salary_min, salary_max, location, expiry_date) VALUES 
('j0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Frontend Developer Intern', 'Looking for a fresh React developer.', 'internship', 'remote', 10000, 20000, 'Hyderabad', NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- And job skills
INSERT INTO job_skills (job_id, skill_id, is_required)
SELECT 'j0000000-0000-0000-0000-000000000001', id, true FROM skills WHERE name IN ('React', 'TypeScript')
ON CONFLICT DO NOTHING;
