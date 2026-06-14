Add these sections inside **Trainer Profile**. Best sidebar/page structure:

```text id="0u1zoh"
My Profile
  - Basic Information
  - Professional Info
  - Skills
  - Work Experience
  - Education
  - Certifications
  - Projects / Achievements
  - Social Links
  - Public Preview
  - Verification Status
```

## Trainer Profile Setup Flow

```text id="m7tlb4"
Trainer opens My Profile
        ↓
Completes Basic Information
        ↓
Adds Professional Info
        ↓
Adds Skills
        ↓
Adds Work Experience
        ↓
Adds Education
        ↓
Adds Certifications
        ↓
Adds Projects / Achievements
        ↓
Adds Social Links
        ↓
Submits profile for admin review
        ↓
Admin approves profile
        ↓
Trainer becomes visible to students
```

## Skills UI

```text id="0oief2"
------------------------------------------------------------
Skills
------------------------------------------------------------

Add skills that describe your expertise.

Skill Name *
[ HR Interview ]

Skill Category *
[ HR / Behavioral v ]

Skill Level *
[ Beginner | Intermediate | Advanced | Expert ]

Years of Experience
[ 5 ]

Is Featured Skill?
[ Yes / No ]

[ + Add Skill ]

------------------------------------------------------------
My Skills
------------------------------------------------------------

HR Interview             Expert        5 years       Featured
CV Review                Advanced      4 years       Featured
English Communication    Advanced      3 years
JavaScript               Intermediate  2 years

[ Edit ] [ Delete ]
------------------------------------------------------------
```

## Work Experience UI

```text id="tkiqto"
------------------------------------------------------------
Work Experience
------------------------------------------------------------

Company Name *
[ Akij Group ]

Job Title *
[ Senior HR Manager ]

Employment Type *
[ Full-time v ]

Location
[ Dhaka, Bangladesh ]

Start Date *
[ Jan 2020 ]

End Date
[ Present ]

Currently Working Here
[ ✓ ]

Description
[ Managed recruitment, interviews, onboarding, and HR operations. ]

Key Responsibilities
[ Conducted interviews, reviewed CVs, managed hiring pipeline. ]

[ + Add Experience ]

------------------------------------------------------------
Experience List
------------------------------------------------------------

Senior HR Manager
Akij Group | Jan 2020 - Present
Dhaka, Bangladesh

Managed recruitment, interviews, onboarding, and HR operations.

[ Edit ] [ Delete ]
------------------------------------------------------------
```

## Education UI

```text id="ntizwt"
------------------------------------------------------------
Education
------------------------------------------------------------

Degree / Qualification *
[ MBA ]

Institution Name *
[ University of Dhaka ]

Field of Study
[ Human Resource Management ]

Start Year
[ 2016 ]

Graduation Year
[ 2018 ]

Grade / CGPA
[ 3.70 ]

Description
[ Specialized in HRM, recruitment, and organizational behavior. ]

[ + Add Education ]

------------------------------------------------------------
Education List
------------------------------------------------------------

MBA in Human Resource Management
University of Dhaka | 2016 - 2018
CGPA: 3.70

[ Edit ] [ Delete ]
------------------------------------------------------------
```

## Certifications UI

```text id="2cr18j"
------------------------------------------------------------
Certifications
------------------------------------------------------------

Certification Name *
[ Certified HR Professional ]

Issuing Organization *
[ HR Institute Bangladesh ]

Certificate ID
[ HR-2026-8842 ]

Certificate URL
[ https://example.com/certificate ]

Issue Date
[ Jan 2024 ]

Expiry Date
[ Jan 2027 ]

Does Not Expire
[ ]

Upload Certificate
[ Choose File ]

[ + Add Certification ]

------------------------------------------------------------
Certification List
------------------------------------------------------------

Certified HR Professional
HR Institute Bangladesh | Issued Jan 2024 | Expires Jan 2027
Status: Verified / Pending Review

[ View ] [ Edit ] [ Delete ]
------------------------------------------------------------
```

## Projects / Achievements UI

```text id="set4f6"
------------------------------------------------------------
Projects / Achievements
------------------------------------------------------------

Title *
[ Campus Recruitment Program 2025 ]

Type *
[ Project | Achievement | Award | Publication | Training Program ]

Organization
[ Akij Group ]

Role
[ Lead HR Coordinator ]

Date
[ Mar 2025 ]

Description *
[ Led a campus recruitment campaign and interviewed 500+ candidates. ]

Result / Impact
[ Hired 80 fresh graduates across multiple departments. ]

Project URL
[ https://example.com/project ]

Attachment
[ Upload proof / image / certificate ]

Show on Public Profile?
[ Yes / No ]

[ + Add Project / Achievement ]

------------------------------------------------------------
Projects & Achievements List
------------------------------------------------------------

Campus Recruitment Program 2025
Project | Akij Group | Lead HR Coordinator

Led a campus recruitment campaign and interviewed 500+ candidates.
Impact: Hired 80 fresh graduates.

[ View ] [ Edit ] [ Delete ]
------------------------------------------------------------
```

## Student Public Trainer Profile View

```text id="61qot6"
------------------------------------------------------------
Trainer Profile
------------------------------------------------------------

Rahim Uddin
Senior HR Manager | HR Interview Trainer
⭐ 4.8 | 245 Sessions | Dhaka, Bangladesh

[ Book Session ]

------------------------------------------------------------
About
------------------------------------------------------------
Professional bio and trainer introduction.

------------------------------------------------------------
Skills
------------------------------------------------------------
HR Interview      Expert
CV Review         Advanced
Communication     Advanced

------------------------------------------------------------
Work Experience
------------------------------------------------------------
Senior HR Manager
Akij Group | Jan 2020 - Present

------------------------------------------------------------
Education
------------------------------------------------------------
MBA in Human Resource Management
University of Dhaka

------------------------------------------------------------
Certifications
------------------------------------------------------------
Certified HR Professional
HR Institute Bangladesh

------------------------------------------------------------
Projects / Achievements
------------------------------------------------------------
Campus Recruitment Program 2025
Hired 80 fresh graduates through structured campus recruitment.

------------------------------------------------------------
Packages
------------------------------------------------------------
HR Mock Interview     ৳1,000     [ Book Now ]
CV Review             ৳500       [ Book Now ]
------------------------------------------------------------
```

## APIs

```text id="u433d4"
Trainer Skills
GET     /trainers/me/skills
POST    /trainers/me/skills
PUT     /trainers/me/skills/{id}
DELETE  /trainers/me/skills/{id}

Trainer Work Experience
GET     /trainers/me/experiences
POST    /trainers/me/experiences
PUT     /trainers/me/experiences/{id}
DELETE  /trainers/me/experiences/{id}

Trainer Education
GET     /trainers/me/education
POST    /trainers/me/education
PUT     /trainers/me/education/{id}
DELETE  /trainers/me/education/{id}

Trainer Certifications
GET     /trainers/me/certifications
POST    /trainers/me/certifications
PUT     /trainers/me/certifications/{id}
DELETE  /trainers/me/certifications/{id}

Trainer Projects / Achievements
GET     /trainers/me/achievements
POST    /trainers/me/achievements
PUT     /trainers/me/achievements/{id}
DELETE  /trainers/me/achievements/{id}

Public Trainer Profile
GET     /trainers/{id}
```

## Database Tables

```text id="uzj4k6"
trainer_skills
- id
- trainer_id
- skill_name
- skill_category
- skill_level
- years_experience
- is_featured
- sort_order
- created_at
- updated_at
```

```text id="md3wrb"
trainer_work_experiences
- id
- trainer_id
- company_name
- job_title
- employment_type
- location
- start_date
- end_date
- is_current
- description
- responsibilities
- sort_order
- created_at
- updated_at
```

```text id="ehc4sr"
trainer_educations
- id
- trainer_id
- degree
- institution_name
- field_of_study
- start_year
- graduation_year
- grade
- description
- sort_order
- created_at
- updated_at
```

```text id="kxrn6u"
trainer_certifications
- id
- trainer_id
- certification_name
- issuing_organization
- certificate_id
- certificate_url
- certificate_file
- issue_date
- expiry_date
- does_not_expire
- verification_status
- sort_order
- created_at
- updated_at
```

```text id="k3m5qv"
trainer_achievements
- id
- trainer_id
- title
- type
- organization
- role
- achievement_date
- description
- result_impact
- project_url
- attachment_file
- is_public
- sort_order
- created_at
- updated_at
```

## Validation Rules

```text id="cfq81l"
- Trainer can add multiple skills.
- Skill name is required.
- Skill level is required.
- Trainer can add multiple work experiences.
- Company name, job title, and start date are required.
- If Currently Working Here is selected, end date should be empty.
- Trainer can add multiple education records.
- Degree and institution name are required.
- Trainer can add multiple certifications.
- Certification name and issuing organization are required.
- Expiry date is optional if Does Not Expire is selected.
- Certificate upload should support PDF, JPG, PNG.
- Trainer can add multiple projects or achievements.
- Project title, type, and description are required.
- Public profile should show only approved/public items.
- Major changes may require admin re-verification.
```

## Copy for Claude

```text id="on6bv3"
Add these Trainer Profile sections for the NextHire project:

1. Skills
2. Work Experience
3. Education
4. Certifications
5. Projects / Achievements

Create a complete product specification including:
- Trainer profile setup flow
- Sidebar/menu structure
- Text-based UI wireframes
- Student public profile view
- API endpoints
- Database tables
- Validation rules
- Admin verification notes

Trainer should be able to add, edit, delete, and reorder all these sections.

APIs required:
GET/POST/PUT/DELETE /trainers/me/skills
GET/POST/PUT/DELETE /trainers/me/experiences
GET/POST/PUT/DELETE /trainers/me/education
GET/POST/PUT/DELETE /trainers/me/certifications
GET/POST/PUT/DELETE /trainers/me/achievements

Make it practical for developers, UI designers, and product managers.
```
