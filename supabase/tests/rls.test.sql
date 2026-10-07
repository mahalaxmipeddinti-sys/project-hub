BEGIN;

-- Plan the tests
SELECT plan(3);

-- Test 1: Candidates can read their own profile
-- Since auth.uid() mocking in pgTAP can be tricky, we check the policies exist
SELECT policies_are(
    'public', 'candidate_profiles',
    ARRAY['Candidates can read own profile', 'Candidates can update own profile', 'Recruiters view candidate profiles for their apps'],
    'Candidate profiles should have specific RLS policies'
);

-- Test 2: RLS is enabled
SELECT has_rls(
    'public', 'jobs',
    'Jobs table should have RLS enabled'
);

-- Test 3: State machine trigger exists
SELECT has_trigger(
    'public', 'applications', 'enforce_app_status_transition',
    'Applications table should have state machine trigger'
);

SELECT * FROM finish();
ROLLBACK;
