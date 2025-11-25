CREATE TABLE IF NOT EXISTS french (
    id SERIAL PRIMARY KEY,
    expression VARCHAR(255) NOT NULL,
    detail TEXT
);

CREATE TABLE IF NOT EXISTS arabic (
    id SERIAL PRIMARY KEY,
    expression_arabic VARCHAR(255) NOT NULL,
    expression_phonetic VARCHAR(255) NOT NULL,
    variant INTEGER CHECK (variant >= 0 AND variant <= 3)
);

CREATE TABLE IF NOT EXISTS translation (
    id SERIAL PRIMARY KEY,
    french_id INTEGER NOT NULL,
    arabic_id INTEGER NOT NULL,
    CONSTRAINT fk_french
        FOREIGN KEY (french_id)
        REFERENCES french(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_arabic
        FOREIGN KEY (arabic_id)
        REFERENCES arabic(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_translation_french ON translation(french_id);
CREATE INDEX IF NOT EXISTS idx_translation_arabic ON translation(arabic_id);

-- Create a unique constraint to prevent duplicate translations
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_translation ON translation(french_id, arabic_id);