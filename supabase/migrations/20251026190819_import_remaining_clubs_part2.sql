/*
  # Import Remaining Sports Clubs (Part 2/3)
  
  Handball, Volleyball, Tennis, Swimming, Athletics, Cycling, Judo, Boxing
*/

-- ====================================================================================
-- HANDBALL CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Saint-Germain Handball', 'handball', 'Paris', 300),
('Montpellier Handball', 'handball', 'Montpellier', 301),
('HBC Nantes', 'handball', 'Nantes', 302),
('Fenix Toulouse Handball', 'handball', 'Toulouse', 303),
('USAM Nîmes Gard', 'handball', 'Nîmes', 304),
('Chambéry Savoie Mont Blanc Handball', 'handball', 'Chambéry', 305),
('Saint-Raphaël Var Handball', 'handball', 'Saint-Raphaël', 306),
('Dunkerque HB Grand Littoral', 'handball', 'Dunkerque', 307),
('Limoges Handball', 'handball', 'Limoges', 308),
('US Ivry Handball', 'handball', 'Ivry', 309),
('PAUC Handball', 'handball', 'Aix-en-Provence', 310),
('Cesson Rennes Métropole Handball', 'handball', 'Rennes', 311),
('Chartres Métropole 28', 'handball', 'Chartres', 312),
('US Créteil Handball', 'handball', 'Créteil', 313),
('Istres Provence Handball', 'handball', 'Istres', 314),
('Tremblay-en-France Handball', 'handball', 'Tremblay-en-France', 315),
('Dijon Handball', 'handball', 'Dijon', 316),
('Billère Handball Pyrénées', 'handball', 'Billère', 317),
('Pontault-Combault Handball', 'handball', 'Pontault-Combault', 318),
('Sélestat Alsace Handball', 'handball', 'Sélestat', 319)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- VOLLEYBALL CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Tours Volley-Ball', 'volleyball', 'Tours', 400),
('Chaumont Volley-Ball 52', 'volleyball', 'Chaumont', 401),
('AS Cannes Volley-Ball', 'volleyball', 'Cannes', 402),
('Tourcoing Lille Métropole', 'volleyball', 'Tourcoing', 403),
('Montpellier UC', 'volleyball', 'Montpellier', 404),
('Arago de Sète', 'volleyball', 'Sète', 405),
('Paris Volley', 'volleyball', 'Paris', 406),
('Narbonne Volley', 'volleyball', 'Narbonne', 407),
('Ajaccio', 'volleyball', 'Ajaccio', 408),
('Nice Volley-Ball', 'volleyball', 'Nice', 409),
('Plessis-Robinson', 'volleyball', 'Le Plessis-Robinson', 410),
('Poitiers Volley-Ball', 'volleyball', 'Poitiers', 411),
('RC Cannes', 'volleyball', 'Cannes', 412),
('Le Cannet Rocheville', 'volleyball', 'Le Cannet', 413),
('Mulhouse Alsace Volley-Ball', 'volleyball', 'Mulhouse', 414),
('Béziers Volley', 'volleyball', 'Béziers', 415),
('Vandœuvre Nancy Volley-Ball', 'volleyball', 'Nancy', 416),
('Nantes Rezé Métropole Volley', 'volleyball', 'Nantes', 417),
('Mougins Volley-Ball', 'volleyball', 'Mougins', 418),
('Saint-Raphaël Var Volley-Ball', 'volleyball', 'Saint-Raphaël', 419)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- TENNIS CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Tennis Club de Paris', 'tennis', 'Paris', 500),
('Racing Club de France', 'tennis', 'Paris', 501),
('Stade Français', 'tennis', 'Paris', 502),
('Tennis Club de Lyon', 'tennis', 'Lyon', 503),
('Tennis Club de Marseille', 'tennis', 'Marseille', 504),
('Nice Lawn Tennis Club', 'tennis', 'Nice', 505),
('Tennis Club de Toulouse', 'tennis', 'Toulouse', 506),
('AS Monaco Tennis', 'tennis', 'Monaco', 507),
('Tennis Club de Strasbourg', 'tennis', 'Strasbourg', 508),
('Tennis Club Boulogne-Billancourt', 'tennis', 'Boulogne-Billancourt', 509),
('Tennis Club de Bordeaux', 'tennis', 'Bordeaux', 510),
('Standard Athletic Club', 'tennis', 'Paris', 511),
('TC Issy-les-Moulineaux', 'tennis', 'Issy-les-Moulineaux', 512)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- SWIMMING CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Olympic Nice Natation', 'natation', 'Nice', 600),
('CN Marseille', 'natation', 'Marseille', 601),
('CN Antibes', 'natation', 'Antibes', 602),
('Dauphins Toulouse OEC', 'natation', 'Toulouse', 603),
('Cercle des Nageurs de Paris', 'natation', 'Paris', 604),
('Mulhouse Olympic Natation', 'natation', 'Mulhouse', 605),
('AS Monaco Natation', 'natation', 'Monaco', 606),
('CN Calédoniens', 'natation', 'Paris', 607),
('Stade de Reims Natation', 'natation', 'Reims', 608),
('Montpellier Métropole Natation', 'natation', 'Montpellier', 609),
('Amiens Métropole Natation', 'natation', 'Amiens', 610),
('Olympique la Garenne-Colombes', 'natation', 'Garenne-Colombes', 611),
('Cercle Nageurs Melun Val de Seine', 'natation', 'Melun', 612),
('Nautic Club Nîmes', 'natation', 'Nîmes', 613)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- ATHLETICS CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('US Créteil Athlétisme', 'athlétisme', 'Créteil', 700),
('Athlétic Club de Boulogne-Billancourt', 'athlétisme', 'Boulogne-Billancourt', 701),
('Entente Franconville Cesame Val-d''Oise', 'athlétisme', 'Franconville', 702),
('Stade Français', 'athlétisme', 'Paris', 703),
('Union Sportive Métropolitaine des Transports', 'athlétisme', 'Paris', 704),
('CA Montreuil 93', 'athlétisme', 'Montreuil', 705),
('Toulouse UC', 'athlétisme', 'Toulouse', 706),
('AC Décines', 'athlétisme', 'Décines', 707),
('Élan 91', 'athlétisme', 'Essonne', 708),
('AS Saint-Médard-en-Jalles', 'athlétisme', 'Saint-Médard-en-Jalles', 709),
('EA Douchy', 'athlétisme', 'Douchy', 710),
('AS La Pomme Marseille', 'athlétisme', 'Marseille', 711),
('Montpellier Athlétisme', 'athlétisme', 'Montpellier', 712)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- CYCLING CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('AG2R Citroën Team', 'cyclisme', 'France', 800),
('Groupama-FDJ', 'cyclisme', 'France', 801),
('Cofidis', 'cyclisme', 'France', 802),
('Arkéa-Samsic', 'cyclisme', 'France', 803),
('TotalEnergies', 'cyclisme', 'France', 804),
('B&B Hotels-KTM', 'cyclisme', 'France', 805),
('Decathlon AG2R La Mondiale', 'cyclisme', 'France', 806),
('US Créteil Cyclisme', 'cyclisme', 'Créteil', 807),
('VC Rouen 76', 'cyclisme', 'Rouen', 808),
('Vélo Club La Pomme Marseille', 'cyclisme', 'Marseille', 809),
('UV Aube', 'cyclisme', 'Aube', 810),
('EC Saint-Étienne', 'cyclisme', 'Saint-Étienne', 811),
('Vélo Sprint Narbonnais', 'cyclisme', 'Narbonne', 812)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- JUDO CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Saint-Germain Judo', 'judo', 'Paris', 900),
('Levallois Sporting Club Judo', 'judo', 'Levallois-Perret', 901),
('Racing Club de France Judo', 'judo', 'Paris', 902),
('US Orléans Judo', 'judo', 'Orléans', 903),
('Red Star Club Champigny', 'judo', 'Champigny', 904),
('AS Monaco Judo', 'judo', 'Monaco', 905),
('Entente Sportive Blanc-Mesnil', 'judo', 'Blanc-Mesnil', 906),
('JC Villebon', 'judo', 'Villebon', 907),
('Stade de Vanves', 'judo', 'Vanves', 908),
('Amiens Judo Club', 'judo', 'Amiens', 909),
('Étoile Sportive du Blanc-Mesnil', 'judo', 'Blanc-Mesnil', 910)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- BOXING CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Université Club Boxing', 'boxe', 'Paris', 1000),
('CSA des Armées', 'boxe', 'Paris', 1001),
('Boxing Beats', 'boxe', 'Paris', 1002),
('Ring Olympique Marseillais', 'boxe', 'Marseille', 1003),
('Noble Art Montpellier', 'boxe', 'Montpellier', 1004),
('ASPTT Paris Boxe', 'boxe', 'Paris', 1005),
('Boxing Club de Nantes', 'boxe', 'Nantes', 1006),
('Team Eliteam Toulouse', 'boxe', 'Toulouse', 1007),
('Le Noble Art de Bordeaux', 'boxe', 'Bordeaux', 1008)
ON CONFLICT (name) DO NOTHING;
