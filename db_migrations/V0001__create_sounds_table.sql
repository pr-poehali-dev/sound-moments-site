CREATE TABLE IF NOT EXISTS sounds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    emoji VARCHAR(10) NOT NULL DEFAULT '🔊',
    audio_url TEXT NOT NULL,
    plays INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sounds (name, emoji, audio_url, plays) VALUES
    ('1 Billion IQ', '🧠', 'https://www.myinstants.com/media/sounds/1-000-000-000-iq.mp3', 42069),
    ('Bruh', '😑', 'https://www.myinstants.com/media/sounds/movie_1.mp3', 98765),
    ('Wow', '😮', 'https://www.myinstants.com/media/sounds/wow.mp3', 54321),
    ('Error', '❌', 'https://www.myinstants.com/media/sounds/error.mp3', 33333),
    ('Victory', '🎉', 'https://www.myinstants.com/media/sounds/victory.mp3', 77777),
    ('Applause', '👏', 'https://www.myinstants.com/media/sounds/applause.mp3', 66666),
    ('Laugh', '😂', 'https://www.myinstants.com/media/sounds/laugh.mp3', 88888),
    ('Airhorn', '📯', 'https://www.myinstants.com/media/sounds/air-horn.mp3', 12345);
