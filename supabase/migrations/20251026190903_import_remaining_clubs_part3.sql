/*
  # Import Remaining Sports Clubs (Part 3/3)
  
  Winter sports, Rowing, Sailing, Fencing, Equestrian, Ice Hockey, Other sports, University, Multisport
*/

-- ====================================================================================
-- WINTER SPORTS CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Ski Club d''Annecy', 'sports_hiver', 'Annecy', 1100),
('CS Chamonix', 'sports_hiver', 'Chamonix', 1101),
('US Autrans', 'sports_hiver', 'Autrans', 1102),
('SC Bois d''Amont', 'sports_hiver', 'Bois d''Amont', 1103),
('SC La Clusaz', 'sports_hiver', 'La Clusaz', 1104),
('SC Megève', 'sports_hiver', 'Megève', 1105),
('US Combloux', 'sports_hiver', 'Combloux', 1106),
('SC Les Rousses', 'sports_hiver', 'Les Rousses', 1107),
('SC Xonrupt', 'sports_hiver', 'Xonrupt', 1108),
('SC Val d''Abondance', 'sports_hiver', 'Val d''Abondance', 1109),
('SC Grand-Bornand', 'sports_hiver', 'Grand-Bornand', 1110),
('Font-Romeu Club Nordique', 'sports_hiver', 'Font-Romeu', 1111),
('Grenoble Université Club Ski', 'sports_hiver', 'Grenoble', 1112)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- ROWING CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Aviron Bayonnais', 'aviron', 'Bayonne', 1200),
('Cercle de l''Aviron de Nancy', 'aviron', 'Nancy', 1201),
('CN Marseille Aviron', 'aviron', 'Marseille', 1202),
('Société Nautique de Bayonne', 'aviron', 'Bayonne', 1203),
('Union Nautique de Lyon', 'aviron', 'Lyon', 1204),
('Rowing Club Strasbourg', 'aviron', 'Strasbourg', 1205),
('Aviron Grenoblois', 'aviron', 'Grenoble', 1206),
('Rowing Club d''Angers', 'aviron', 'Angers', 1207),
('Aviron Toulousain', 'aviron', 'Toulouse', 1208),
('Club Nautique de France', 'aviron', 'Paris', 1209),
('Cercle de l''Aviron de Paris', 'aviron', 'Paris', 1210)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- SAILING CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Yacht Club de France', 'voile', 'Paris', 1300),
('Société Nautique de Marseille', 'voile', 'Marseille', 1301),
('ENVSN Brest', 'voile', 'Brest', 1302),
('Yacht Club de Monaco', 'voile', 'Monaco', 1303),
('Cercle Nautique de Nice', 'voile', 'Nice', 1304),
('Cercle de la Voile de Paris', 'voile', 'Paris', 1305),
('Yacht Club de Toulon', 'voile', 'Toulon', 1306),
('Société des Régates Rochelaises', 'voile', 'La Rochelle', 1307),
('Union Nautique de Bordeaux', 'voile', 'Bordeaux', 1308),
('Cercle Nautique Calédonien', 'voile', 'Paris', 1309),
('Société Nautique de la Baie de Saint-Malo', 'voile', 'Saint-Malo', 1310)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- FENCING CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Paris Université Club Escrime', 'escrime', 'Paris', 1400),
('Racing Club de France Escrime', 'escrime', 'Paris', 1401),
('CS Bois-Colombes', 'escrime', 'Bois-Colombes', 1402),
('US Métro Transport', 'escrime', 'Paris', 1403),
('Stade Français Escrime', 'escrime', 'Paris', 1404),
('AS Monaco Escrime', 'escrime', 'Monaco', 1405),
('Lagardère Paris Racing', 'escrime', 'Paris', 1406),
('Lyon Escrime', 'escrime', 'Lyon', 1407),
('Cercle d''Escrime Melun Val de Seine', 'escrime', 'Melun', 1408),
('Bourg-la-Reine Escrime', 'escrime', 'Bourg-la-Reine', 1409)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- EQUESTRIAN CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Haras de Jardy', 'équitation', 'Paris', 1500),
('Pôle International du Cheval', 'équitation', 'France', 1501),
('Écurie du Lys', 'équitation', 'France', 1502),
('Écuries du Grand Parquet', 'équitation', 'France', 1503),
('Centre Équestre de Fontainebleau', 'équitation', 'Fontainebleau', 1504),
('Haras de Hus', 'équitation', 'France', 1505),
('Cavaliers du Bois', 'équitation', 'France', 1506),
('Poney Club du Touquet', 'équitation', 'Le Touquet', 1507),
('Écuries de la Cense', 'équitation', 'France', 1508),
('Centre Équestre de Lamotte-Beuvron', 'équitation', 'Lamotte-Beuvron', 1509)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- ICE HOCKEY CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('Brûleurs de Loups de Grenoble', 'hockey', 'Grenoble', 1600),
('Dragons de Rouen', 'hockey', 'Rouen', 1601),
('Boxers de Bordeaux', 'hockey', 'Bordeaux', 1602),
('Rapaces de Gap', 'hockey', 'Gap', 1603),
('Pionniers de Chamonix', 'hockey', 'Chamonix', 1604),
('Gothiques d''Amiens', 'hockey', 'Amiens', 1605),
('Ducs d''Angers', 'hockey', 'Angers', 1606),
('Aigles de Nice', 'hockey', 'Nice', 1607),
('Hormadi Anglet', 'hockey', 'Anglet', 1608),
('Scorpions de Mulhouse', 'hockey', 'Mulhouse', 1609)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- UNIVERSITY CLUBS
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('ASUL Lyon Sport Universitaire', 'universitaire', 'Lyon', 1700),
('Bureau des Sports - Sorbonne', 'universitaire', 'Paris', 1701),
('Club Athlétique des Sports Généraux de Paris', 'universitaire', 'Paris', 1702),
('Sport Universitaire de Bordeaux', 'universitaire', 'Bordeaux', 1703),
('Bureau des Sports - Université Paris-Saclay', 'universitaire', 'Paris', 1704),
('CRSU Toulouse', 'universitaire', 'Toulouse', 1705),
('SUAPS - Université de Nantes', 'universitaire', 'Nantes', 1706),
('Sport Universitaire Grenoble', 'universitaire', 'Grenoble', 1707),
('Sport Universitaire Marseille', 'universitaire', 'Marseille', 1708),
('Sport Universitaire Nice', 'universitaire', 'Nice', 1709),
('Sport Universitaire Montpellier', 'universitaire', 'Montpellier', 1710),
('Sport Universitaire Rennes', 'universitaire', 'Rennes', 1711),
('Sport Universitaire Strasbourg', 'universitaire', 'Strasbourg', 1712),
('FFSU - Fédération Française Sport Universitaire', 'universitaire', 'Paris', 1713)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================================
-- MULTISPORT CLUBS (ASPTT, CREPS, INSEP, etc.)
-- ====================================================================================
INSERT INTO clubs_reference (name, sport_category, city, display_order) VALUES
('ASPTT Paris', 'multisports', 'Paris', 1800),
('ASPTT Marseille', 'multisports', 'Marseille', 1801),
('ASPTT Lyon', 'multisports', 'Lyon', 1802),
('ASPTT Toulouse', 'multisports', 'Toulouse', 1803),
('ASPTT Nice', 'multisports', 'Nice', 1804),
('ASPTT Strasbourg', 'multisports', 'Strasbourg', 1805),
('ASPTT Bordeaux', 'multisports', 'Bordeaux', 1806),
('ASPTT Lille', 'multisports', 'Lille', 1807),
('ASPTT Nantes', 'multisports', 'Nantes', 1808),
('ASPTT Montpellier', 'multisports', 'Montpellier', 1809),
('ASPTT Nancy', 'multisports', 'Nancy', 1810),
('ASPTT Rennes', 'multisports', 'Rennes', 1811),
('ASPTT Grenoble', 'multisports', 'Grenoble', 1812),
('ASPTT Rouen', 'multisports', 'Rouen', 1813),
('ASPTT Clermont-Ferrand', 'multisports', 'Clermont-Ferrand', 1814),
('INSEP (Institut National du Sport)', 'multisports', 'Paris', 1815),
('CREPS Île-de-France', 'multisports', 'Paris', 1816),
('CREPS PACA', 'multisports', 'Aix-en-Provence', 1817),
('CREPS Rhône-Alpes', 'multisports', 'Lyon', 1818),
('CREPS Bretagne', 'multisports', 'Rennes', 1819),
('Roland-Garros', 'multisports', 'Paris', 1820),
('US Métro Transport', 'multisports', 'Paris', 1821),
('Racing Club de France', 'multisports', 'Paris', 1822),
('Stade Français', 'multisports', 'Paris', 1823),
('Red Star Club', 'multisports', 'Paris', 1824),
('Union Sportive Créteil', 'multisports', 'Créteil', 1825)
ON CONFLICT (name) DO NOTHING;
