-- Fix existing hours data by converting to text or setting to default value
-- This handles data that was stored as DateTime but is now String

-- For any invalid datetime values, convert them to a default time string
UPDATE "Doctors" 
SET "hours" = CAST('09:00-18:00' AS VARCHAR(100))
WHERE "hours" IS NOT NULL AND "hours" != '';

-- Update any NULL values to a default
UPDATE "Doctors"
SET "hours" = '09:00-18:00'
WHERE "hours" IS NULL;
