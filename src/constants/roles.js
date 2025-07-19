export const ROLES = {
  JOB_SEEKER: 'JobSeeker',
  EMPLOYER: 'Employer',
  COMPANY: 'Company',
  ADMIN: 'Admin'
};

export const VALID_ROLES = Object.values(ROLES);

export const ROLE_DISPLAY_NAMES = {
  [ROLES.JOB_SEEKER]: 'Job Seeker',
  [ROLES.EMPLOYER]: 'Employer',
  [ROLES.COMPANY]: 'Company',
  [ROLES.ADMIN]: 'Administrator'
};
