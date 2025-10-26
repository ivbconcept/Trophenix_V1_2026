/*
  # Import Final Batch - Other Sports Clubs
  
  Gymnastics, Squash, Badminton, Taekwondo, Karate, Trampoline, Skateboard, BMX, Climbing, 
  Padel, Futsal, Beach Sports, Martial Arts, Golf, Triathlon, Pentathlon, Shooting, Petanque
*/

-- ====================================================================================
-- GYMNASTICS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Stade Français Gymnastique', 'gymnastique', 'Paris', 2000),
('AS Monaco Gymnastique', 'gymnastique', 'Monaco', 2001),
('Paris Gymnastique', 'gymnastique', 'Paris', 2002),
('INSEP Gymnastique', 'gymnastique', 'Paris', 2003),
('Avoine Beaumont Gymnastique', 'gymnastique', 'Avoine', 2004),
('Gym Montois', 'gymnastique', 'Mons', 2005)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- SQUASH CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Squash Montmartre', 'squash', 'Paris', 2100),
('Squash Club de Paris', 'squash', 'Paris', 2101),
('Squash 34 Montpellier', 'squash', 'Montpellier', 2102),
('Squash Club Lyon', 'squash', 'Lyon', 2103),
('Squash Marseille', 'squash', 'Marseille', 2104),
('Squash Toulouse', 'squash', 'Toulouse', 2105)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- BADMINTON CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris UC Badminton', 'badminton', 'Paris', 2200),
('Boulogne 92 Badminton', 'badminton', 'Boulogne-Billancourt', 2201),
('Marseille UC Badminton', 'badminton', 'Marseille', 2202),
('Chambéry Savoie Badminton', 'badminton', 'Chambéry', 2203),
('Rouen Badminton', 'badminton', 'Rouen', 2204),
('Toulouse Badminton Club', 'badminton', 'Toulouse', 2205)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- TAEKWONDO CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Taekwondo', 'taekwondo', 'Paris', 2300),
('Villejuif Taekwondo', 'taekwondo', 'Villejuif', 2301),
('Marseille Taekwondo Club', 'taekwondo', 'Marseille', 2302),
('Lyon Taekwondo', 'taekwondo', 'Lyon', 2303),
('Toulouse Taekwondo', 'taekwondo', 'Toulouse', 2304),
('Club Taekwondo Strasbourg', 'taekwondo', 'Strasbourg', 2305)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- KARATE CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Saint-Germain Karaté', 'karate', 'Paris', 2400),
('Karaté Club Bois-Colombes', 'karate', 'Bois-Colombes', 2401),
('Karaté Toulouse', 'karate', 'Toulouse', 2402),
('Karaté Club de Paris', 'karate', 'Paris', 2403),
('Shotokan Karaté Marseille', 'karate', 'Marseille', 2404),
('Karaté Lyon', 'karate', 'Lyon', 2405)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- TRAMPOLINE CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Amicale Laïque Eaubonne Trampoline', 'trampoline', 'Eaubonne', 2500),
('ACROSPORT Toulouse', 'trampoline', 'Toulouse', 2501),
('Trampoline Club Nantes', 'trampoline', 'Nantes', 2502)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- SKATEBOARD / BMX
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Cosanostra Skateboard Lyon', 'skateboard', 'Lyon', 2600),
('Jungle Spot Bordeaux', 'skateboard', 'Bordeaux', 2601),
('BMX Club Paris', 'bmx', 'Paris', 2602),
('Marseille Skate Park', 'skateboard', 'Marseille', 2603),
('Nantes BMX Club', 'bmx', 'Nantes', 2604)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- CLIMBING (ESCALADE)
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Club Alpin Français Paris', 'escalade', 'Paris', 2700),
('Grimporama Lyon', 'escalade', 'Lyon', 2701),
('Entre-Prises Lille', 'escalade', 'Lille', 2702),
('Arkose Paris', 'escalade', 'Paris', 2703),
('Climb Up Marseille', 'escalade', 'Marseille', 2704),
('Vertical Art Toulouse', 'escalade', 'Toulouse', 2705)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- PADEL CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Padel Club Paris', 'padel', 'Paris', 2800),
('Ten Padel Marseille', 'padel', 'Marseille', 2801),
('Padel Horizon Lyon', 'padel', 'Lyon', 2802),
('We Are Padel Toulouse', 'padel', 'Toulouse', 2803),
('Padel Attitude Bordeaux', 'padel', 'Bordeaux', 2804)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- FUTSAL CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Acasa Futsal', 'futsal', 'Paris', 2900),
('Kremlin-Bicêtre United', 'futsal', 'Kremlin-Bicêtre', 2901),
('Futsal Club de Nantes', 'futsal', 'Nantes', 2902),
('Toulon Elite Futsal', 'futsal', 'Toulon', 2903),
('Roubaix Futsal', 'futsal', 'Roubaix', 2904),
('Lyon Futsal', 'futsal', 'Lyon', 2905)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- BEACH SPORTS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Beach Volley Club Paris', 'beach_sports', 'Paris', 3000),
('Marseille Beach Soccer', 'beach_sports', 'Marseille', 3001),
('Beach Rugby Hossegor', 'beach_sports', 'Hossegor', 3002),
('Beach Handball Lacanau', 'beach_sports', 'Lacanau', 3003)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- MARTIAL ARTS / MMA
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Fighting System', 'arts_martiaux', 'Paris', 3100),
('Bushido Marseille', 'arts_martiaux', 'Marseille', 3101),
('Sambo Club Paris', 'arts_martiaux', 'Paris', 3102),
('MMA Factory Paris', 'arts_martiaux', 'Paris', 3103),
('Dragon Bleu Paris', 'arts_martiaux', 'Paris', 3104),
('Fight Club Toulouse', 'arts_martiaux', 'Toulouse', 3105),
('Jiu-Jitsu Brésilien Paris', 'arts_martiaux', 'Paris', 3106),
('Muay Thai Paris', 'arts_martiaux', 'Paris', 3107)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- GOLF CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Golf de Saint-Cloud', 'golf', 'Saint-Cloud', 3200),
('Golf National Guyancourt', 'golf', 'Guyancourt', 3201),
('Golf de Chantilly', 'golf', 'Chantilly', 3202),
('Golf du Médoc', 'golf', 'Médoc', 3203),
('Golf de Fontainebleau', 'golf', 'Fontainebleau', 3204),
('Golf de Lyon', 'golf', 'Lyon', 3205),
('Golf d''Aix-en-Provence', 'golf', 'Aix-en-Provence', 3206),
('Golf International de Barrière', 'golf', 'Barrière', 3207)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- TRIATHLON CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Triathlon', 'triathlon', 'Paris', 3300),
('Triathlon Club Versailles', 'triathlon', 'Versailles', 3301),
('Nice Triathlon', 'triathlon', 'Nice', 3302),
('Lyon Triathlon', 'triathlon', 'Lyon', 3303),
('Poissy Triathlon', 'triathlon', 'Poissy', 3304),
('Triathlon Toulouse Métropole', 'triathlon', 'Toulouse', 3305)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- PENTATHLON MODERNE
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Pentathlon Moderne', 'pentathlon', 'Paris', 3400),
('Clamart Pentathlon', 'pentathlon', 'Clamart', 3401),
('Lyon Pentathlon', 'pentathlon', 'Lyon', 3402)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- SHOOTING (TIR)
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Tir Sportif Paris', 'tir', 'Paris', 3500),
('Fédération Française de Tir Paris', 'tir', 'Paris', 3501),
('Club de Tir Marseille', 'tir', 'Marseille', 3502),
('Tir à l''Arc Paris', 'tir', 'Paris', 3503)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- PETANQUE / BOULES
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Pétanque Club Paris', 'petanque', 'Paris', 3600),
('Boules Parisiennes', 'petanque', 'Paris', 3601),
('Marseille Pétanque', 'petanque', 'Marseille', 3602),
('Lyon Pétanque Sport', 'petanque', 'Lyon', 3603),
('Nice Bouliste', 'petanque', 'Nice', 3604)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- CORPORATE / ENTERPRISE CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Club Sportif Air France', 'multisports', 'Paris', 3700),
('Club Sportif EDF-GDF', 'multisports', 'Paris', 3701),
('Club Sportif RATP', 'multisports', 'Paris', 3702),
('Club Sportif SNCF', 'multisports', 'Paris', 3703),
('Amicale Sportive Renault', 'multisports', 'Paris', 3704),
('Club Sportif Orange', 'multisports', 'Paris', 3705)
ON CONFLICT (name) DO NOTHING;
