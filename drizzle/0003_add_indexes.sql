-- Add indexes on all userId foreign key columns for query performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_resume_id ON cover_letters(resume_id);
CREATE INDEX IF NOT EXISTS idx_self_evaluations_user_id ON self_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_contacts_user_id ON employer_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_contacts_status ON employer_contacts(status);
CREATE INDEX IF NOT EXISTS idx_employer_contacts_follow_up ON employer_contacts(follow_up_date);
