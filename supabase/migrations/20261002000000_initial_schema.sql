-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE user_role AS ENUM ('candidate', 'recruiter', 'hiring_manager', 'admin');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE work_mode AS ENUM ('on-site', 'hybrid', 'remote');
CREATE TYPE application_status AS ENUM ('applied', 'screening', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'talent_pool');
CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tables
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    website TEXT,
    verified BOOLEAN DEFAULT FALSE,
    gst_cin TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employer_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    position TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    locations TEXT[],
    salary_expectation NUMERIC,
    notice_period_days INTEGER,
    resume_url TEXT,
    resume_hash TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    profile_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type job_type NOT NULL,
    mode work_mode NOT NULL,
    salary_min NUMERIC,
    salary_max NUMERIC CHECK (salary_min <= salary_max),
    location TEXT,
    expiry_date TIMESTAMPTZ NOT NULL CHECK (expiry_date > NOW()),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE candidate_skills (
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE job_skills (
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (job_id, skill_id)
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE NOT NULL,
    status application_status DEFAULT 'applied' NOT NULL,
    match_score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(job_id, candidate_id)
);

CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    from_status application_status,
    to_status application_status NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
    interviewer_id UUID REFERENCES employer_profiles(id) ON DELETE SET NULL,
    date_time TIMESTAMPTZ NOT NULL,
    type TEXT,
    jitsi_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE interview_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE NOT NULL,
    interviewer_id UUID REFERENCES employer_profiles(id) ON DELETE SET NULL,
    score INTEGER CHECK (score >= 1 AND score <= 5),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recruiter_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
    recruiter_id UUID REFERENCES employer_profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_jobs (
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (candidate_id, job_id)
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    plan TEXT NOT NULL,
    valid_until TIMESTAMPTZ,
    jobs_limit INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_employer_profiles_modtime BEFORE UPDATE ON employer_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_candidate_profiles_modtime BEFORE UPDATE ON candidate_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_jobs_modtime BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_applications_modtime BEFORE UPDATE ON applications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- State Machine Logic Function
CREATE OR REPLACE FUNCTION check_application_transition()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Basic state machine enforcement (can be expanded)
        IF NEW.status = 'rejected' THEN
            -- allowed from any state
            NULL;
        ELSIF OLD.status = 'applied' AND NEW.status != 'screening' THEN
            RAISE EXCEPTION 'Invalid transition from applied to %', NEW.status;
        ELSIF OLD.status = 'screening' AND NEW.status NOT IN ('shortlisted', 'rejected') THEN
            RAISE EXCEPTION 'Invalid transition from screening to %', NEW.status;
        -- (Add rest of the machine logic as needed for interview, offer, hired)
        END IF;

        -- Write to history
        INSERT INTO application_status_history (application_id, user_id, from_status, to_status)
        VALUES (NEW.id, auth.uid(), OLD.status, NEW.status);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_app_status_transition
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE PROCEDURE check_application_transition();

-- Indexes for performance
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_apps_job_status ON applications(job_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_candidate_skills_candidate ON candidate_skills(candidate_id);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_notes ENABLE ROW LEVEL SECURITY;

-- Policies for Candidates
CREATE POLICY "Candidates can read own profile" ON candidate_profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Candidates can update own profile" ON candidate_profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Candidates can view published jobs" ON jobs FOR SELECT TO authenticated USING (is_active = TRUE AND expiry_date > NOW());
CREATE POLICY "Candidates can view own applications" ON applications FOR SELECT TO authenticated USING (candidate_id = auth.uid());
CREATE POLICY "Candidates can apply" ON applications FOR INSERT TO authenticated WITH CHECK (candidate_id = auth.uid());

-- Policies for Recruiters
CREATE POLICY "Recruiters can view their company jobs" ON jobs FOR SELECT TO authenticated USING (company_id = (SELECT company_id FROM employer_profiles WHERE id = auth.uid()));
CREATE POLICY "Recruiters can manage their company jobs" ON jobs FOR ALL TO authenticated USING (company_id = (SELECT company_id FROM employer_profiles WHERE id = auth.uid()));
CREATE POLICY "Recruiters can view apps for their jobs" ON applications FOR SELECT TO authenticated USING (job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM employer_profiles WHERE id = auth.uid())));
CREATE POLICY "Recruiters can update apps for their jobs" ON applications FOR UPDATE TO authenticated USING (job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM employer_profiles WHERE id = auth.uid())));
CREATE POLICY "Recruiters view candidate profiles for their apps" ON candidate_profiles FOR SELECT TO authenticated USING (id IN (SELECT candidate_id FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = (SELECT company_id FROM employer_profiles WHERE id = auth.uid()))));
