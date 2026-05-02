BEGIN;

TRUNCATE TABLE gallery_items, testimonials, events, services, projects, ministries RESTART IDENTITY CASCADE;

INSERT INTO ministries (title, slug, short_description, description, scripture, icon_name, image_url, featured, sort_order)
VALUES
  (
    'Church Planting Networks',
    'church-planting-networks',
    'Establishing life-giving churches that carry the Gospel with wisdom, beauty, and compassion.',
    'Living Christ Global Outreach advances the Gospel through strategic church planting across cities, towns, and underserved communities. Each new congregation is designed to become a Christ-centered hub for worship, discipleship, pastoral care, and community transformation.',
    'Go therefore and make disciples of all nations.',
    'cross',
    '/assets/images/ministry-1.svg',
    TRUE,
    1
  ),
  (
    'Leadership Equipping Hub',
    'leadership-equipping-hub',
    'Forming pastors, mentors, and servant-leaders with theological depth and practical excellence.',
    'We equip leaders through Bible training, mentoring pipelines, ministry residencies, and spiritual formation environments that raise mature voices for the church and the marketplace. The goal is not simply information, but transformed leaders who can faithfully shepherd people and steward vision.',
    'Entrust to faithful people who will be able to teach others also.',
    'book',
    '/assets/images/ministry-2.svg',
    TRUE,
    2
  ),
  (
    'Compassion and Outreach Missions',
    'compassion-and-outreach-missions',
    'Serving vulnerable communities with mercy ministries that reflect the love of Christ.',
    'Our outreach expression brings tangible care to families, children, women, youth, and elderly people through charity, relief support, housing assistance, counseling, and economic empowerment. We believe ministry must minister to the whole person: spirit, soul, and body.',
    'Let us not love in word or talk but in deed and in truth.',
    'heart',
    '/assets/images/ministry-3.svg',
    TRUE,
    3
  ),
  (
    'Worship and Prayer Altars',
    'worship-and-prayer-altars',
    'Cultivating reverent spaces of intercession, healing worship, and spiritual awakening.',
    'Prayer fuels every part of the mission. Through worship encounters, revival gatherings, prayer chains, and pastoral care circles, we create sacred spaces where people can encounter God, receive healing, and be strengthened in their faith journey.',
    'My house shall be called a house of prayer.',
    'dove',
    '/assets/images/ministry-4.svg',
    FALSE,
    4
  );

INSERT INTO projects (title, slug, category, short_description, description, location, project_status, image_url, featured, sort_order)
VALUES
  (
    'In Christ School of Holy Spirit',
    'in-christ-school-of-holy-spirit',
    'current',
    'A formation initiative focused on spiritual maturity, prayer culture, and Holy Spirit-led living.',
    'This current project establishes a disciplined learning environment for spiritual growth, biblical grounding, and practical ministry activation. It is designed to raise believers who live with spiritual discernment, reverence, and compassionate action.',
    'India',
    'active',
    '/assets/images/project-1.svg',
    TRUE,
    1
  ),
  (
    'In Christ School of Self Equipping',
    'in-christ-school-of-self-equipping',
    'current',
    'An educational platform equipping believers with ministry, leadership, and life skills.',
    'This project develops self-equipping frameworks for ministry workers, volunteers, and community leaders. It combines biblical teaching, vocational insight, and strategic mentoring to help individuals serve with excellence and resilience.',
    'India',
    'active',
    '/assets/images/project-2.svg',
    TRUE,
    2
  ),
  (
    'In Christ School of Counselling',
    'in-christ-school-of-counselling',
    'current',
    'A counseling formation center serving emotional, relational, and family restoration needs.',
    'The counselling school prepares leaders and caregivers to provide sound biblical guidance, trauma-aware support, and restorative care for individuals, marriages, and families facing complex emotional realities.',
    'India',
    'active',
    '/assets/images/project-3.svg',
    FALSE,
    3
  ),
  (
    'Main Campus',
    'main-campus',
    'future',
    'A flagship ministry campus designed for worship, education, leadership development, and social outreach.',
    'The future main campus will serve as the physical and spiritual headquarters of Living Christ Global Outreach. It is envisioned as a place for worship gatherings, ministry training, counseling, administration, and community development programs under one integrated mission environment.',
    'India',
    'planned',
    '/assets/images/project-4.svg',
    TRUE,
    4
  ),
  (
    'International School',
    'international-school',
    'future',
    'A high-impact learning institution combining academic excellence with Christian values formation.',
    'The international school project aims to raise children and young leaders through a balanced model of academic rigor, spiritual formation, innovation, and compassionate leadership that prepares them for global influence.',
    'India',
    'planned',
    '/assets/images/project-5.svg',
    FALSE,
    5
  ),
  (
    'Home of Shelters',
    'home-of-shelters',
    'expansion',
    'A compassionate housing initiative for vulnerable people requiring safety, dignity, and care.',
    'This expansion project focuses on developing safe and dignified shelter environments for vulnerable individuals and families, including elderly care and emergency relief accommodation integrated with pastoral and social support.',
    'India',
    'planned',
    '/assets/images/project-6.svg',
    TRUE,
    6
  ),
  (
    'School of Business',
    'school-of-business',
    'expansion',
    'An enterprise and stewardship training center for economic upliftment and entrepreneurship.',
    'The School of Business will offer entrepreneurial formation, vocational readiness, business mentoring, and ethical leadership development that empowers communities to build sustainable economic futures with integrity.',
    'India',
    'planned',
    '/assets/images/project-7.svg',
    FALSE,
    7
  );

INSERT INTO services (title, slug, short_description, description, audience, image_url, featured, sort_order)
VALUES
  (
    'Education and Formation',
    'education-and-formation',
    'Bible schools, institutions, scholarships, and holistic learning pathways grounded in Christ.',
    'Our education service pillar builds spiritually rooted and socially capable communities through schools, scholarship support, learning institutions, and Bible-centered development environments for children, youth, and emerging leaders.',
    'Children, youth, leaders, students',
    '/assets/images/service-1.svg',
    TRUE,
    1
  ),
  (
    'Healthcare and Relief',
    'healthcare-and-relief',
    'Clinics, medical camps, counseling support, and compassionate care for vulnerable communities.',
    'We create access to healthcare through clinics, medical camps, prayer-centered care environments, and support pathways that restore dignity, provide timely intervention, and communicate the love of Christ through service.',
    'Families, elderly people, underserved communities',
    '/assets/images/service-2.svg',
    TRUE,
    2
  ),
  (
    'Outreach and Restoration',
    'outreach-and-restoration',
    'Charity, women and youth empowerment, housing support, and humanitarian outreach.',
    'This service stream responds to social and economic needs through outreach missions, skill development, entrepreneurship support, family care, disaster relief, and Christ-centered restoration programs that rebuild hope in tangible ways.',
    'Women, youth, families, communities',
    '/assets/images/service-3.svg',
    TRUE,
    3
  );

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

INSERT INTO gallery_items (title, category, alt_text, image_url, is_featured, sort_order)
VALUES
  ('Prayer Gathering', 'Worship', 'Congregation in worship under golden light', '/assets/images/gallery-1.svg', TRUE, 1),
  ('Leadership Training', 'Leadership', 'Ministry leaders in a training environment', '/assets/images/gallery-2.svg', TRUE, 2),
  ('Children Education Outreach', 'Education', 'Children engaged in ministry education', '/assets/images/gallery-3.svg', TRUE, 3),
  ('Medical Care Mission', 'Healthcare', 'Compassion-centered healthcare outreach scene', '/assets/images/gallery-4.svg', FALSE, 4),
  ('Community Compassion', 'Outreach', 'Hands extended in community care', '/assets/images/gallery-5.svg', FALSE, 5),
  ('Youth Empowerment', 'Youth', 'Young leaders gathered around a purpose-driven vision', '/assets/images/gallery-6.svg', FALSE, 6);

COMMIT;

