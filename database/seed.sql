BEGIN;

TRUNCATE TABLE gallery_items, testimonials, events, services, projects, ministries RESTART IDENTITY CASCADE;

-- ============================================================
-- MINISTRIES
-- New columns: num (VARCHAR4), subgroups (JSONB), cta (JSONB)
-- ============================================================

INSERT INTO ministries (
  num, title, slug, short_description, description,
  scripture, icon_name, image_url, featured, sort_order,
  subgroups, cta
)
VALUES
  (
    '01',
    'Spiritual & Evangelical',
    'spiritual-evangelical',
    'Preaching the Gospel, making disciples, planting churches, and raising Christian leaders for Kingdom impact.',
    'Living Christ Global Outreach advances the Gospel through strategic church planting across cities, towns, and underserved communities. Each new congregation is designed to become a Christ-centered hub for worship, discipleship, pastoral care, and community transformation.',
    'Go therefore and make disciples of all nations.',
    'cross',
    '/assets/images/ministry-1.svg',
    TRUE,
    1,
    '[
      {"label":"InChrist School of the Holy Spirit","items":["3 Months Certificate Program","6 Months Ministry Training","1 Year Diploma Program","2 Year Advanced Ministry Leadership"]},
      {"label":"Specialized Training","items":["Global Pastors & Leaders Training","Teachers Training Programme","Youth Leadership Training","Women''s Ministry Training","Evangelism & Discipleship Training","Prayer and Revival Conferences"]},
      {"label":"Church Planting & Mission Outreach","items":["Plant churches across Africa","Conduct evangelistic crusades","Establish prayer groups","Mentor local leaders"]}
    ]'::jsonb,
    '["Apply Now","Register"]'::jsonb
  ),
  (
    '02',
    'Education & Training',
    'education-training',
    'Providing biblical, academic, vocational, and leadership training to empower individuals and communities.',
    'We equip leaders through Bible training, mentoring pipelines, ministry residencies, and spiritual formation environments that raise mature voices for the church and the marketplace. The goal is not simply information, but transformed leaders who can faithfully shepherd people and steward vision.',
    'Entrust to faithful people who will be able to teach others also.',
    'book',
    '/assets/images/ministry-2.svg',
    TRUE,
    2,
    '[
      {"label":"Leadership Development","items":["Christian Leadership Courses","Biblical Studies","Community Leadership Training","Teacher Development Programs"]},
      {"label":"Educational Support","items":["Scholarships for needy children","School supplies and materials","Bible schools & discipleship centres","Youth mentoring programmes"]},
      {"label":"Vocational Training","items":["Computer Skills","Entrepreneurship Training","Financial Literacy","Small Business Management","Agricultural Skills Development"]}
    ]'::jsonb,
    '["Apply Now","Register"]'::jsonb
  ),
  (
    '03',
    'Social Development',
    'social-development',
    'Building stronger communities through humanitarian service, social support, and community transformation.',
    'Our outreach expression brings tangible care to families, children, women, youth, and elderly people through charity, relief support, housing assistance, counseling, and economic empowerment. We believe ministry must minister to the whole person: spirit, soul, and body.',
    'Let us not love in word or talk but in deed and in truth.',
    'heart',
    '/assets/images/ministry-3.svg',
    TRUE,
    3,
    '[
      {"label":"Community Development","items":["Housing support for vulnerable families","Community infrastructure development","Elderly care programmes","Child protection initiatives"]},
      {"label":"Humanitarian Relief","items":["Food distribution","Emergency assistance","Disaster response","Rehabilitation programmes"]},
      {"label":"Family Support","items":["Marriage counselling","Parenting programmes","Community support groups","Poverty alleviation initiatives"]}
    ]'::jsonb,
    '["Contact Us"]'::jsonb
  ),
  (
    '04',
    'Healthcare & Welfare',
    'healthcare-welfare',
    'Providing healthcare support, wellness education, and compassionate care to vulnerable communities.',
    'We create access to healthcare through clinics, medical camps, prayer-centered care environments, and support pathways that restore dignity, provide timely intervention, and communicate the love of Christ through service.',
    'My house shall be called a house of prayer.',
    'dove',
    '/assets/images/ministry-4.svg',
    FALSE,
    4,
    '[
      {"label":"Medical Outreach Programmes","items":["Community medical camps","Health screenings","Maternal and child healthcare","Health awareness campaigns"]},
      {"label":"Welfare Services","items":["Support for vulnerable families","Care for elderly individuals","Assistance for persons with disabilities","Palliative care support"]},
      {"label":"Health Education","items":["Nutrition awareness","Disease prevention","Hygiene and sanitation education","Mental health awareness"]}
    ]'::jsonb,
    '["Contact Us"]'::jsonb
  ),
  (
    '05',
    'Women & Youth',
    'women-youth',
    'Empowering women and young people through leadership development, life skills, and economic empowerment.',
    'This service stream responds to social and economic needs through outreach missions, skill development, entrepreneurship support, family care, disaster relief, and Christ-centered restoration programs that rebuild hope in tangible ways.',
    'She opens her hand to the poor and reaches out her hands to the needy.',
    'heart',
    '/assets/images/ministry-5.svg',
    FALSE,
    5,
    '[
      {"label":"Women Empowerment","items":["Tailoring & Fashion Design","Embroidery & Handicrafts","Cake Making & Baking","Beauty & Cosmetology","Snack Production"]},
      {"label":"Youth Development","items":["Leadership Training","Career Guidance","Entrepreneurship Development","Life Skills Training","Christian Mentorship"]},
      {"label":"Awareness Programmes","items":["Drug Abuse Prevention","Sexual Abuse Awareness","Mental Health Awareness","Responsible Social Media Usage"]}
    ]'::jsonb,
    '["Contact Us"]'::jsonb
  ),
  (
    '06',
    'Humanitarian Relief',
    'humanitarian-relief',
    'Disaster relief, rehabilitation, and emergency support for affected communities across Africa.',
    'Prayer fuels every part of the mission. Through worship encounters, revival gatherings, prayer chains, and pastoral care circles, we create sacred spaces where people can encounter God, receive healing, and be strengthened in their faith journey.',
    'Blessed are the merciful, for they shall receive mercy.',
    'dove',
    '/assets/images/ministry-6.svg',
    FALSE,
    6,
    '[
      {"label":"Emergency Response","items":["Disaster relief operations","Emergency food & shelter","Rehabilitation programmes","Crisis counselling support"]},
      {"label":"Community Aid","items":["Food distribution drives","Clean water access projects","Sanitation improvement","Basic needs support"]},
      {"label":"Long-term Recovery","items":["Community rebuilding","Economic recovery support","Trauma healing programmes","Infrastructure restoration"]}
    ]'::jsonb,
    '["Contact Us"]'::jsonb
  );


-- ============================================================
-- PROJECTS
-- New column: num (VARCHAR4)
-- ============================================================

INSERT INTO projects (
  num, title, slug, category, short_description, description,
  location, project_status, image_url, featured, sort_order
)
VALUES
  (
    '01',
    'InChrist School of the Holy Spirit — Campus Building',
    'inchrist-school-holy-spirit-campus',
    'current',
    '3-storey building with 5 classrooms (30 seats each), mini auditorium, chapel, dormitory for 150 students, faculty accommodation, library, offices, mess, kitchen, toilets & bathrooms.',
    'This current project establishes a disciplined learning environment for spiritual growth, biblical grounding, and practical ministry activation. It is designed to raise believers who live with spiritual discernment, reverence, and compassionate action.',
    'Uganda, Africa',
    'active',
    '/assets/images/project-1.svg',
    TRUE,
    1
  ),
  (
    '02',
    '100-Bed Old Age & Palliative Home',
    '100-bed-old-age-palliative-home',
    'future',
    'Fully equipped care facility with 100 beds, kitchen, dining hall, prayer room, bathrooms & toilets, mess, and dedicated palliative care support for the elderly and terminally ill.',
    'This project develops self-equipping frameworks for ministry workers, volunteers, and community leaders. It combines biblical teaching, vocational insight, and strategic mentoring to help individuals serve with excellence and resilience.',
    'Uganda, Africa',
    'planned',
    '/assets/images/project-2.svg',
    TRUE,
    2
  ),
  (
    '03',
    'Church Building — 1,000-Seat Sanctuary',
    'church-building-1000-seat-sanctuary',
    'future',
    'A dedicated house of worship accommodating 1,000 people, with modern facilities, bathrooms, and space designed for vibrant congregational life and outreach.',
    'The counselling school prepares leaders and caregivers to provide sound biblical guidance, trauma-aware support, and restorative care for individuals, marriages, and families facing complex emotional realities.',
    'Uganda, Africa',
    'planned',
    '/assets/images/project-3.svg',
    FALSE,
    3
  ),
  (
    '04',
    'InChrist International School — Secular Campus',
    'inchrist-international-school-secular',
    'future',
    '3-storey school building with classrooms, offices, teachers'' rooms, playground, mess, kitchen, toilets & bathrooms — a quality secular education institution serving the community.',
    'The future main campus will serve as the physical and spiritual headquarters of Living Christ Global Outreach. It is envisioned as a place for worship gatherings, ministry training, counseling, administration, and community development programs under one integrated mission environment.',
    'Uganda, Africa',
    'planned',
    '/assets/images/project-4.svg',
    TRUE,
    4
  ),
  (
    '05',
    'Orphanage',
    'orphanage',
    'expansion',
    'A safe, nurturing home for orphaned children with residential accommodation, educational support, nutrition, spiritual care, and life-skills development programs.',
    'The international school project aims to raise children and young leaders through a balanced model of academic rigor, spiritual formation, innovation, and compassionate leadership that prepares them for global influence.',
    'Uganda, Africa',
    'planned',
    '/assets/images/project-5.svg',
    FALSE,
    5
  ),
  (
    '06',
    '10-Acre Land Acquisition & Ministry Vehicle',
    '10-acre-land-acquisition-ministry-vehicle',
    'expansion',
    'Securing 10 acres of land to consolidate all ministry campuses in one God-given location, along with a ministry vehicle for outreach, pastoral visits, and project operations.',
    'This expansion project focuses on developing safe and dignified shelter environments for vulnerable individuals and families, including elderly care and emergency relief accommodation integrated with pastoral and social support.',
    'Uganda, Africa',
    'planned',
    '/assets/images/project-6.svg',
    TRUE,
    6
  ),
  (
    '07',
    'Bethany Health Care — Hospital & Medical Centre',
    'bethany-health-care-hospital',
    'expansion',
    'A faith-based hospital and medical centre providing accessible, compassionate healthcare. Envisions wards, OPD, pharmacy, maternity unit, laboratory, theatre, emergency services, and prayer/counselling.',
    'The School of Business will offer entrepreneurial formation, vocational readiness, business mentoring, and ethical leadership development that empowers communities to build sustainable economic futures with integrity.',
    'Uganda, Africa',
    'planned',
    '/assets/images/project-7.svg',
    FALSE,
    7
  );


-- ============================================================
-- SERVICES
-- New columns: num (VARCHAR4), cta (VARCHAR100)
-- ============================================================

INSERT INTO services (
  num, title, slug, short_description, description,
  audience, image_url, featured, sort_order, cta
)
VALUES
  (
    '01',
    'Pastoral & Counseling Services',
    'pastoral-counseling-services',
    'Spiritual, emotional, family, and youth counseling available to all who seek peace and direction.',
    'Our education service pillar builds spiritually rooted and socially capable communities through schools, scholarship support, learning institutions, and Bible-centered development environments for children, youth, and emerging leaders.',
    'Individuals, families, youth',
    '/assets/images/service-1.svg',
    TRUE,
    1,
    'Contact Us'
  ),
  (
    '02',
    'Leadership Development Seminars',
    'leadership-development-seminars',
    'Conferences and training programs for church leaders, pastors, and community builders.',
    'We create access to healthcare through clinics, medical camps, prayer-centered care environments, and support pathways that restore dignity, provide timely intervention, and communicate the love of Christ through service.',
    'Pastors, church leaders, community builders',
    '/assets/images/service-2.svg',
    TRUE,
    2,
    'Know More'
  ),
  (
    '03',
    'Economic Empowerment & Entrepreneurship',
    'economic-empowerment-entrepreneurship',
    'Financial literacy, small business training, and skills for sustainable livelihoods.',
    'This service stream responds to social and economic needs through outreach missions, skill development, entrepreneurship support, family care, disaster relief, and Christ-centered restoration programs that rebuild hope in tangible ways.',
    'Women, youth, families, communities',
    '/assets/images/service-3.svg',
    TRUE,
    3,
    'Know More'
  ),
  (
    '04',
    'Drug Abuse & Social Awareness',
    'drug-abuse-social-awareness',
    'Community programs addressing moral values, family welfare, and substance addiction.',
    'Community outreach programs that address the root causes of substance abuse and social breakdown through education, counseling, family support, and Christ-centered restoration.',
    'Youth, families, communities',
    '/assets/images/service-4.svg',
    FALSE,
    4,
    'Contact Us'
  ),
  (
    '05',
    'Medical Outreach & Community Health Camps',
    'medical-outreach-community-health-camps',
    'Free health screenings, medicine distribution, maternal care, and health awareness campaigns.',
    'Our medical outreach brings free primary care, health screenings, maternal support, and health education directly to underserved communities with compassion and dignity.',
    'Families, elderly, underserved communities',
    '/assets/images/service-5.svg',
    FALSE,
    5,
    'Contact Us'
  ),
  (
    '06',
    'Child & Orphan Care',
    'child-orphan-care',
    'Residential care, educational support, nutrition, and Christian mentorship for orphaned children.',
    'We provide safe, loving, and structured residential environments for orphaned and vulnerable children, integrating education, nutrition, spiritual formation, and life-skills development.',
    'Orphaned children, vulnerable youth',
    '/assets/images/service-6.svg',
    FALSE,
    6,
    'Contact Us'
  ),
  (
    '07',
    'Women''s Vocational Skills Training',
    'womens-vocational-skills-training',
    'Tailoring, baking, beauty, handicrafts, and entrepreneurship training empowering women toward self-reliance.',
    'Practical vocational training equips women with marketable skills in tailoring, baking, beauty, and handicrafts, empowering them toward financial independence and community leadership.',
    'Women, young mothers',
    '/assets/images/service-7.svg',
    FALSE,
    7,
    'Know More'
  ),
  (
    '08',
    'Church Planting & Evangelistic Missions',
    'church-planting-evangelistic-missions',
    'Sending trained missionaries to plant churches and conduct crusades across Africa.',
    'We send and support trained missionaries across Africa to plant life-giving churches, conduct evangelistic crusades, and establish prayer and discipleship communities in unreached areas.',
    'Missionaries, church planters, communities',
    '/assets/images/service-8.svg',
    FALSE,
    8,
    'Know More'
  ),
  (
    '09',
    'Elderly & Palliative Care',
    'elderly-palliative-care',
    'Compassionate residential and outreach care for the aged, terminally ill, and vulnerable.',
    'We provide compassionate residential care and outreach support for elderly and terminally ill individuals, ensuring dignity, attentive care, and spiritual comfort in their final seasons of life.',
    'Elderly, terminally ill, vulnerable adults',
    '/assets/images/service-9.svg',
    FALSE,
    9,
    'Contact Us'
  ),
  (
    '10',
    'Humanitarian Relief & Disaster Response',
    'humanitarian-relief-disaster-response',
    'Emergency food, shelter, rehabilitation, and crisis support for disaster-affected communities.',
    'Our disaster response teams mobilize rapidly to provide emergency food, shelter, rehabilitation support, and crisis counseling to communities affected by natural disasters and conflict.',
    'Disaster-affected communities',
    '/assets/images/service-10.svg',
    FALSE,
    10,
    'Contact Us'
  );


-- ============================================================
-- EVENTS (unchanged from original)
-- ============================================================

INSERT INTO events (title, slug, short_description, description, location, event_date, registration_url, image_url, featured, sort_order)
VALUES
  (
    'Global Revival and Leadership Summit',
    'global-revival-and-leadership-summit',
    'A gathering for pastors, ministry leaders, and revival carriers to align vision and strengthen mission.',
    'This summit convenes leaders for strategic prayer, theological formation, leadership empowerment, and collaborative vision around church planting, discipleship, social impact, and global partnership.',
    'Chennai, India',
    '2026-07-18 09:00:00+05:30',
    'https://livingchrist.org/register/revival-summit',
    '/assets/images/event-1.svg',
    TRUE,
    1
  ),
  (
    'Healing and Hope Medical Mission',
    'healing-and-hope-medical-mission',
    'A ministry program delivering prayer, primary care support, and community health interventions.',
    'The Healing and Hope Medical Mission combines medical camps, pastoral care, health education, and family support in a unified outreach expression serving communities with both compassion and excellence.',
    'Bengaluru, India',
    '2026-08-29 08:00:00+05:30',
    'https://livingchrist.org/register/medical-mission',
    '/assets/images/event-2.svg',
    TRUE,
    2
  ),
  (
    'Youth Fire and Enterprise Forum',
    'youth-fire-and-enterprise-forum',
    'A catalytic forum for spiritually grounded youth leadership, innovation, and enterprise.',
    'This forum brings together youth, mentors, and entrepreneurs for worship, leadership teaching, business insight, and courageous conversation around calling, creativity, and community transformation.',
    'Hyderabad, India',
    '2026-10-10 10:30:00+05:30',
    'https://livingchrist.org/register/youth-forum',
    '/assets/images/event-3.svg',
    FALSE,
    3
  );


-- ============================================================
-- TESTIMONIALS (unchanged from original)
-- ============================================================

INSERT INTO testimonials (person_name, designation, church_name, testimony_text, rating, image_url, is_featured, sort_order)
VALUES
  (
    'Pastor Daniel Joseph',
    'Regional Ministry Leader',
    'Living Christ Fellowship',
    'The vision of Living Christ is deeply rooted in prayer, excellence, and transformation. Their work among leaders and communities has strengthened churches and restored hope to families in remarkable ways.',
    5,
    '/assets/images/testimonial-1.svg',
    TRUE,
    1
  ),
  (
    'Grace Miriam',
    'Youth Mentor and Educator',
    'Kingdom Learning Network',
    'I have witnessed students and young leaders grow in confidence, discipline, and spiritual maturity through their education and mentoring initiatives. The ministry carries both conviction and compassion.',
    5,
    '/assets/images/testimonial-2.svg',
    TRUE,
    2
  ),
  (
    'Dr. Samuel Raj',
    'Community Health Volunteer',
    'Hope Care Mission',
    'Their healthcare and outreach programs minister to the whole person. People do not just receive services; they encounter dignity, attentive care, and the love of Christ.',
    5,
    '/assets/images/testimonial-3.svg',
    FALSE,
    3
  );


-- ============================================================
-- GALLERY (unchanged from original)
-- ============================================================

INSERT INTO gallery_items (title, category, alt_text, image_url, is_featured, sort_order)
VALUES
  ('Prayer Gathering',            'Worship',    'Congregation in worship under golden light',          '/assets/images/gallery-1.svg', TRUE,  1),
  ('Leadership Training',         'Leadership', 'Ministry leaders in a training environment',          '/assets/images/gallery-2.svg', TRUE,  2),
  ('Children Education Outreach', 'Education',  'Children engaged in ministry education',              '/assets/images/gallery-3.svg', TRUE,  3),
  ('Medical Care Mission',        'Healthcare', 'Compassion-centered healthcare outreach scene',       '/assets/images/gallery-4.svg', FALSE, 4),
  ('Community Compassion',        'Outreach',   'Hands extended in community care',                    '/assets/images/gallery-5.svg', FALSE, 5),
  ('Youth Empowerment',           'Youth',      'Young leaders gathered around a purpose-driven vision','/assets/images/gallery-6.svg', FALSE, 6);

COMMIT;