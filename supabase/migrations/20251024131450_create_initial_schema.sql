/*
  # Schéma initial pour La Forge Athlétique
  
  ## Description
  Ce schéma crée toutes les tables nécessaires pour l'application de suivi des performances athlétiques.
  
  ## Nouvelles Tables
  
  ### `coaches`
  Profils des entraîneurs avec leurs préférences et informations personnelles
  - `id` (uuid, PK) - Lié à auth.users
  - `first_name` (text) - Prénom
  - `last_name` (text) - Nom
  - `email` (text) - Email
  - `phone` (text) - Téléphone
  - `specialization` (text) - Spécialisation
  - `certifications` (text[]) - Certifications
  - `bio` (text) - Biographie
  - `avatar` (text) - URL avatar
  - `preferences` (jsonb) - Préférences (thème, langue, etc.)
  - `created_at` (timestamptz) - Date de création
  - `updated_at` (timestamptz) - Date de mise à jour
  
  ### `athletes`
  Profils des athlètes avec leurs informations personnelles et objectifs
  - `id` (uuid, PK)
  - `coach_id` (uuid, FK) - Référence au coach
  - `first_name`, `last_name` - Identité
  - `date_of_birth` (date) - Date de naissance
  - `sex` (text) - Sexe
  - `dominant_hand`, `dominant_foot` (text) - Latéralité
  - `sport`, `discipline`, `position` (text) - Sport pratiqué
  - `current_level` (text) - Niveau actuel
  - `competition_calendar` (text) - Calendrier compétitions
  - `constraints` (text) - Contraintes
  - `medical_history` (text) - Historique médical
  - `medical_contacts` (jsonb) - Contacts médicaux
  - `medical_authorizations` (text) - Autorisations médicales
  - `goals` (jsonb) - Objectifs SMART
  - `nutrition_profile` (jsonb) - Profil nutritionnel
  - `training_plan` (jsonb) - Plan d'entraînement
  - `is_archived` (boolean) - Archivé ou non
  - `created_at`, `updated_at` (timestamptz)
  
  ### `injury_records`
  Historique des blessures des athlètes
  - `id` (uuid, PK)
  - `athlete_id` (uuid, FK)
  - `date` (date) - Date de la blessure
  - `type` (text) - Type de blessure
  - `mechanism`, `diagnosis`, `treatment` (text)
  - `recovery_duration` (integer) - Durée en jours
  - `surgery` (boolean)
  - `rehab_program` (text)
  - `risk_factors` (text[])
  - `created_at` (timestamptz)
  
  ### `metric_types`
  Types de métriques disponibles (anthropométrie, force, endurance, etc.)
  - `id` (uuid, PK)
  - `name` (text) - Nom de la métrique
  - `category` (text) - Catégorie
  - `unit` (text) - Unité de mesure
  - `data_type` (text) - Type de données
  - `description` (text) - Description
  - `is_higher_better` (boolean) - Si une valeur plus haute est meilleure
  - `created_at` (timestamptz)
  
  ### `measurements`
  Mesures individuelles pour chaque athlète
  - `id` (uuid, PK)
  - `athlete_id` (uuid, FK)
  - `metric_type_id` (uuid, FK)
  - `date` (date) - Date de la mesure
  - `value` (text) - Valeur (peut être nombre ou texte)
  - `unit` (text) - Unité
  - `notes` (text) - Notes
  - `created_at` (timestamptz)
  
  ### `wellness_logs`
  Journal de bien-être quotidien
  - `id` (uuid, PK)
  - `athlete_id` (uuid, FK)
  - `date` (date)
  - `sleep_duration` (numeric) - Durée de sommeil
  - `sleep_quality` (integer) - Qualité 1-5
  - `fatigue`, `soreness`, `stress`, `mood`, `appetite` (integer) - Échelles 1-5
  - `pain_level` (integer) - 0-10
  - `pain_location` (text)
  - `hydration` (numeric) - Litres
  - `menstrual_cycle` (text)
  - `notes` (text)
  - `created_at` (timestamptz)
  
  ## Sécurité
  - RLS activé sur toutes les tables
  - Les coaches peuvent uniquement accéder à leurs propres données et celles de leurs athlètes
  - Les tables sont verrouillées par défaut jusqu'à l'ajout des policies
*/

-- Création des tables

CREATE TABLE IF NOT EXISTS coaches (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  specialization text,
  certifications text[] DEFAULT '{}',
  bio text,
  avatar text,
  preferences jsonb DEFAULT '{"theme": "light", "language": "fr", "notifications": true, "measurementUnits": "metric"}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  sex text NOT NULL CHECK (sex IN ('M', 'F', 'Autre')),
  dominant_hand text CHECK (dominant_hand IN ('Droite', 'Gauche', 'Ambidextre')),
  dominant_foot text CHECK (dominant_foot IN ('Droit', 'Gauche', 'Ambidextre')),
  sport text NOT NULL,
  discipline text,
  position text,
  current_level text NOT NULL,
  competition_calendar text,
  constraints text,
  medical_history text,
  medical_contacts jsonb DEFAULT '[]'::jsonb,
  medical_authorizations text,
  goals jsonb DEFAULT '{}'::jsonb,
  nutrition_profile jsonb DEFAULT '{}'::jsonb,
  training_plan jsonb DEFAULT '{}'::jsonb,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS injury_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  date date NOT NULL,
  type text NOT NULL,
  mechanism text,
  diagnosis text,
  treatment text,
  recovery_duration integer,
  surgery boolean DEFAULT false,
  rehab_program text,
  risk_factors text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metric_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('ANTHROPOMETRIE', 'FORCE_MAXIMALE', 'PUISSANCE_VITESSE', 'ENDURANCE', 'WELLNESS', 'CHARGE_ENTRAINEMENT', 'NUTRITION')),
  unit text NOT NULL,
  data_type text NOT NULL CHECK (data_type IN ('number', 'string', 'boolean')),
  description text,
  is_higher_better boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  metric_type_id uuid NOT NULL REFERENCES metric_types(id) ON DELETE CASCADE,
  date date NOT NULL,
  value text NOT NULL,
  unit text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wellness_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  date date NOT NULL,
  sleep_duration numeric(4,1),
  sleep_quality integer CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  fatigue integer CHECK (fatigue >= 1 AND fatigue <= 5),
  soreness integer CHECK (soreness >= 1 AND soreness <= 5),
  stress integer CHECK (stress >= 1 AND stress <= 5),
  mood integer CHECK (mood >= 1 AND mood <= 5),
  pain_level integer CHECK (pain_level >= 0 AND pain_level <= 10),
  pain_location text,
  appetite integer CHECK (appetite >= 1 AND appetite <= 5),
  hydration numeric(4,1),
  menstrual_cycle text,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(athlete_id, date)
);

-- Création des index pour optimiser les requêtes

CREATE INDEX IF NOT EXISTS idx_athletes_coach_id ON athletes(coach_id);
CREATE INDEX IF NOT EXISTS idx_athletes_is_archived ON athletes(is_archived);
CREATE INDEX IF NOT EXISTS idx_injury_records_athlete_id ON injury_records(athlete_id);
CREATE INDEX IF NOT EXISTS idx_measurements_athlete_id ON measurements(athlete_id);
CREATE INDEX IF NOT EXISTS idx_measurements_metric_type_id ON measurements(metric_type_id);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON measurements(date);
CREATE INDEX IF NOT EXISTS idx_wellness_logs_athlete_id ON wellness_logs(athlete_id);
CREATE INDEX IF NOT EXISTS idx_wellness_logs_date ON wellness_logs(date);

-- Activation de RLS sur toutes les tables

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE injury_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour coaches

CREATE POLICY "Coaches can view own profile"
  ON coaches FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Coaches can update own profile"
  ON coaches FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Coaches can insert own profile"
  ON coaches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies pour athletes

CREATE POLICY "Coaches can view own athletes"
  ON athletes FOR SELECT
  TO authenticated
  USING (coach_id = auth.uid());

CREATE POLICY "Coaches can insert own athletes"
  ON athletes FOR INSERT
  TO authenticated
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can update own athletes"
  ON athletes FOR UPDATE
  TO authenticated
  USING (coach_id = auth.uid())
  WITH CHECK (coach_id = auth.uid());

CREATE POLICY "Coaches can delete own athletes"
  ON athletes FOR DELETE
  TO authenticated
  USING (coach_id = auth.uid());

-- Policies pour injury_records

CREATE POLICY "Coaches can view injury records of own athletes"
  ON injury_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = injury_records.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can insert injury records for own athletes"
  ON injury_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = injury_records.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can update injury records of own athletes"
  ON injury_records FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = injury_records.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = injury_records.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can delete injury records of own athletes"
  ON injury_records FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = injury_records.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

-- Policies pour metric_types (lecture publique pour utilisateurs authentifiés)

CREATE POLICY "Authenticated users can view metric types"
  ON metric_types FOR SELECT
  TO authenticated
  USING (true);

-- Policies pour measurements

CREATE POLICY "Coaches can view measurements of own athletes"
  ON measurements FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = measurements.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can insert measurements for own athletes"
  ON measurements FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = measurements.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can update measurements of own athletes"
  ON measurements FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = measurements.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = measurements.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can delete measurements of own athletes"
  ON measurements FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = measurements.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

-- Policies pour wellness_logs

CREATE POLICY "Coaches can view wellness logs of own athletes"
  ON wellness_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = wellness_logs.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can insert wellness logs for own athletes"
  ON wellness_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = wellness_logs.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can update wellness logs of own athletes"
  ON wellness_logs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = wellness_logs.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = wellness_logs.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can delete wellness logs of own athletes"
  ON wellness_logs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM athletes
      WHERE athletes.id = wellness_logs.athlete_id
      AND athletes.coach_id = auth.uid()
    )
  );

-- Fonction pour mettre à jour automatiquement updated_at

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at

CREATE TRIGGER update_coaches_updated_at
  BEFORE UPDATE ON coaches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athletes_updated_at
  BEFORE UPDATE ON athletes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();