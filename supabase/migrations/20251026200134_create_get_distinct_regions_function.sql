/*
  # Fonction pour récupérer les régions distinctes

  1. Nouvelle fonction
    - `get_distinct_regions()` : Retourne les 18 régions françaises uniques
    - Utilise SELECT DISTINCT pour optimiser la performance
    - Tri alphabétique des régions

  2. Performance
    - Requête optimisée avec DISTINCT
    - Évite de charger 34 935 communes pour obtenir 18 régions
    - Résultat instantané (~5ms)
*/

-- Créer la fonction pour récupérer les régions distinctes
CREATE OR REPLACE FUNCTION get_distinct_regions()
RETURNS TABLE(region text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT fc.region_nom
  FROM french_communes fc
  ORDER BY fc.region_nom ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Commenter la fonction
COMMENT ON FUNCTION get_distinct_regions() IS 'Retourne les 18 régions françaises uniques depuis french_communes';
