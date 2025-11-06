/*
  # Optimize RLS Auth Initialization

  This migration optimizes RLS policies by wrapping auth functions with SELECT.
  This prevents re-evaluation of auth functions for each row, significantly improving query performance.

  ## Changes
  1. Drop and recreate organizers RLS policies with optimized auth calls
  2. Drop and recreate competitions RLS policies with optimized auth calls
  3. Drop and recreate competition_categories RLS policies with optimized auth calls
  4. Drop and recreate competition_applications RLS policies with optimized auth calls
  5. Drop and recreate competition_documents RLS policies with optimized auth calls
*/

-- Organizers policies
DROP POLICY IF EXISTS "Organizers are viewable by authenticated users" ON public.organizers;
DROP POLICY IF EXISTS "Users can create their organizer profile" ON public.organizers;
DROP POLICY IF EXISTS "Organizers can update their own profile" ON public.organizers;

CREATE POLICY "Organizers are viewable by authenticated users"
  ON public.organizers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their organizer profile"
  ON public.organizers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Organizers can update their own profile"
  ON public.organizers FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Competitions policies
DROP POLICY IF EXISTS "Published competitions are viewable by everyone" ON public.competitions;
DROP POLICY IF EXISTS "Verified organizers can create competitions" ON public.competitions;
DROP POLICY IF EXISTS "Organizers can update their own competitions" ON public.competitions;
DROP POLICY IF EXISTS "Organizers and admins can delete competitions" ON public.competitions;

CREATE POLICY "Published competitions are viewable by everyone"
  ON public.competitions FOR SELECT
  USING (
    status = 'published' OR
    organizer_id IN (
      SELECT id FROM public.organizers 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Verified organizers can create competitions"
  ON public.competitions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizers 
      WHERE id = organizer_id 
      AND user_id = (SELECT auth.uid())
      AND verification_status = 'verified'
    )
  );

CREATE POLICY "Organizers can update their own competitions"
  ON public.competitions FOR UPDATE
  TO authenticated
  USING (
    organizer_id IN (
      SELECT id FROM public.organizers 
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    organizer_id IN (
      SELECT id FROM public.organizers 
      WHERE user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organizers and admins can delete competitions"
  ON public.competitions FOR DELETE
  TO authenticated
  USING (
    organizer_id IN (
      SELECT id FROM public.organizers 
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Competition categories policies
DROP POLICY IF EXISTS "Categories are viewable with their competition" ON public.competition_categories;
DROP POLICY IF EXISTS "Organizers can manage categories of their competitions" ON public.competition_categories;
DROP POLICY IF EXISTS "Organizers can update categories of their competitions" ON public.competition_categories;
DROP POLICY IF EXISTS "Organizers can delete categories of their competitions" ON public.competition_categories;

CREATE POLICY "Categories are viewable with their competition"
  ON public.competition_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.competitions c
      WHERE c.id = competition_id
      AND (
        c.status = 'published' OR
        c.organizer_id IN (
          SELECT id FROM public.organizers 
          WHERE user_id = (SELECT auth.uid())
        )
      )
    )
  );

CREATE POLICY "Organizers can manage categories of their competitions"
  ON public.competition_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organizers can update categories of their competitions"
  ON public.competition_categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Organizers can delete categories of their competitions"
  ON public.competition_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  );

-- Competition applications policies
DROP POLICY IF EXISTS "Athletes and organizers can view relevant applications" ON public.competition_applications;
DROP POLICY IF EXISTS "Athletes can apply to competitions" ON public.competition_applications;
DROP POLICY IF EXISTS "Athletes and organizers can update applications" ON public.competition_applications;
DROP POLICY IF EXISTS "Athletes can withdraw their applications" ON public.competition_applications;

CREATE POLICY "Athletes and organizers can view relevant applications"
  ON public.competition_applications FOR SELECT
  TO authenticated
  USING (
    athlete_user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Athletes can apply to competitions"
  ON public.competition_applications FOR INSERT
  TO authenticated
  WITH CHECK (athlete_user_id = (SELECT auth.uid()));

CREATE POLICY "Athletes and organizers can update applications"
  ON public.competition_applications FOR UPDATE
  TO authenticated
  USING (
    athlete_user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    athlete_user_id = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Athletes can withdraw their applications"
  ON public.competition_applications FOR DELETE
  TO authenticated
  USING (athlete_user_id = (SELECT auth.uid()));

-- Competition documents policies
DROP POLICY IF EXISTS "Documents are viewable by organizer and approved participants" ON public.competition_documents;
DROP POLICY IF EXISTS "Organizers can upload documents to their competitions" ON public.competition_documents;
DROP POLICY IF EXISTS "Document uploaders can update their documents" ON public.competition_documents;
DROP POLICY IF EXISTS "Document uploaders can delete their documents" ON public.competition_documents;

CREATE POLICY "Documents are viewable by organizer and approved participants"
  ON public.competition_documents FOR SELECT
  TO authenticated
  USING (
    uploaded_by = (SELECT auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    ) OR
    EXISTS (
      SELECT 1 FROM public.competition_applications ca
      WHERE ca.competition_id = competition_documents.competition_id
      AND ca.athlete_user_id = (SELECT auth.uid())
      AND ca.status = 'approved'
    )
  );

CREATE POLICY "Organizers can upload documents to their competitions"
  ON public.competition_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.competitions c
      JOIN public.organizers o ON c.organizer_id = o.id
      WHERE c.id = competition_id
      AND o.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Document uploaders can update their documents"
  ON public.competition_documents FOR UPDATE
  TO authenticated
  USING (uploaded_by = (SELECT auth.uid()))
  WITH CHECK (uploaded_by = (SELECT auth.uid()));

CREATE POLICY "Document uploaders can delete their documents"
  ON public.competition_documents FOR DELETE
  TO authenticated
  USING (uploaded_by = (SELECT auth.uid()));