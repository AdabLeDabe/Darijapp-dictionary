CREATE TABLE IF NOT EXISTS french (
    id SERIAL PRIMARY KEY,
    expression VARCHAR(255) NOT NULL,
    detail TEXT,
    CONSTRAINT expression_not_blank CHECK (LENGTH(TRIM(expression)) > 0)
);

CREATE TABLE IF NOT EXISTS arabic (
    id SERIAL PRIMARY KEY,
    expression_arabic VARCHAR(255) NOT NULL,
    expression_phonetic VARCHAR(255) NOT NULL,
    variant INTEGER CHECK (variant >= 0 AND variant <= 3),
    CONSTRAINT arabic_expression_not_blank CHECK (LENGTH(TRIM(expression_arabic)) > 0),
    CONSTRAINT phonetic_expression_not_blank CHECK (LENGTH(TRIM(expression_phonetic)) > 0)
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

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT category_name_not_blank CHECK (LENGTH(TRIM(category_name)) > 0)
);

CREATE TABLE IF NOT EXISTS french_category (
    id SERIAL PRIMARY KEY,
    french_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT fk_french
        FOREIGN KEY (french_id)
        REFERENCES french(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_translation_french ON translation(french_id);
CREATE INDEX IF NOT EXISTS idx_translation_arabic ON translation(arabic_id);
CREATE INDEX IF NOT EXISTS idx_category_french ON french_category(french_id);
CREATE INDEX IF NOT EXISTS idx_category_category ON french_category(category_id);

-- Create a unique constraint to prevent duplicate translations & categories
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_translation ON translation(french_id, arabic_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_category ON french_category(french_id, category_id);