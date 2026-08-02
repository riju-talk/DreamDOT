-- PostgreSQL Seed Data for DreamDot
-- Initializes test users, profiles, and posts/items metadata

-- ==================== USER_D SCHEMA ====================

-- Insert test users
INSERT INTO user_d.users (id, email, phone, password_hash, pass_salts, user_type, is_verified, is_active, initial_balance, created_at, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alice@dreamdot.com', '+1234567890', 'hashed_password_alice', 'salt_alice', 'user', true, true, 50000, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440002', 'bob@dreamdot.com', '+1234567891', 'hashed_password_bob', 'salt_bob', 'creator', true, true, 75000, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440003', 'charlie@dreamdot.com', '+1234567892', 'hashed_password_charlie', 'salt_charlie', 'user', true, true, 50000, now(), now()),
  ('550e8400-e29b-41d4-a716-446655440004', 'diana@dreamdot.com', '+1234567893', 'hashed_password_diana', 'salt_diana', 'creator', true, true, 100000, now(), now());

-- Insert user profiles
INSERT INTO user_d.user_profile (user_id, username, display_name, bio, avatar_url, banner_url, website, social_links, dob, country, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'alice_dreams', 'Alice Wonder', 'Digital artist and content creator | #art #design', 'https://i.pravatar.cc/150?img=1', 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1000&h=300&fit=crop', 'https://alice.art', '{"twitter": "alice_dreams", "instagram": "@alice_wonders"}', '1995-05-15'::date, 'USA', now()),
  ('550e8400-e29b-41d4-a716-446655440002', 'bob_writes', 'Bob Writer', 'Indie author & storyteller | Publishing my journey online', 'https://i.pravatar.cc/150?img=2', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=300&fit=crop', 'https://bobwrites.com', '{"twitter": "bob_writes", "github": "bobwriter"}', '1990-08-22'::date, 'Canada', now()),
  ('550e8400-e29b-41d4-a716-446655440003', 'charlie_code', 'Charlie Coder', 'Full-stack developer | Open source enthusiast', 'https://i.pravatar.cc/150?img=3', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&h=300&fit=crop', 'https://github.com/charlie', '{"github": "charliecode", "linkedin": "/in/charlie"}', '1992-12-10'::date, 'UK', now()),
  ('550e8400-e29b-41d4-a716-446655440004', 'diana_music', 'Diana Sound', 'Music producer & sound designer | Electronic beats', 'https://i.pravatar.cc/150?img=4', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&h=300&fit=crop', 'https://dianasound.music', '{"twitter": "@diana_music", "soundcloud": "diana_sound"}', '1998-03-07'::date, 'Germany', now());

-- Insert user analytics
INSERT INTO user_d.user_analytics (user_id, posts_count, likes_received, followers_count, following_count, last_login, activity_score)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 12, 245, 512, 423, now(), 87.50),
  ('550e8400-e29b-41d4-a716-446655440002', 28, 1850, 1243, 89, now(), 94.30),
  ('550e8400-e29b-41d4-a716-446655440003', 5, 67, 102, 234, now(), 65.75),
  ('550e8400-e29b-41d4-a716-446655440004', 42, 3421, 2156, 567, now(), 96.15);

-- Insert user security & sessions
INSERT INTO user_d.user_security (user_id, failed_attempts, last_failed_login, updated_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 0, NULL, now()),
  ('550e8400-e29b-41d4-a716-446655440002', 0, NULL, now()),
  ('550e8400-e29b-41d4-a716-446655440003', 0, NULL, now()),
  ('550e8400-e29b-41d4-a716-446655440004', 0, NULL, now());

-- ==================== SOCIAL SCHEMA ====================

-- Insert posts metadata (links to MongoDB posts collection)
INSERT INTO social.posts (id, user_id, sql_id, description, visibility, created_at, updated_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'mongo_post_001', 'Check out my latest digital artwork!', true, now() - interval '7 days', now() - interval '7 days'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'mongo_post_002', 'Tutorial: Creating gradient meshes in design software', true, now() - interval '5 days', now() - interval '5 days'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'mongo_post_003', 'Chapter 1 of my new novel is live!', true, now() - interval '3 days', now() - interval '3 days'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'mongo_post_004', 'Writing tips: How to develop compelling characters', true, now() - interval '2 days', now() - interval '2 days'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'mongo_post_005', 'New track: Ambient Dream - Free download!', true, now() - interval '1 days', now() - interval '1 days');

-- Insert posts analytics
INSERT INTO social.posts_analytics (post_id, views_count, likes_count, comments_count, updated_at)
VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 156, 45, 12, now()),
  ('660e8400-e29b-41d4-a716-446655440002', 432, 123, 28, now()),
  ('660e8400-e29b-41d4-a716-446655440003', 892, 234, 67, now()),
  ('660e8400-e29b-41d4-a716-446655440004', 567, 156, 42, now()),
  ('660e8400-e29b-41d4-a716-446655440005', 234, 89, 15, now());

-- Insert likes
INSERT INTO social.likes (user_id, post_id, liked_at)
VALUES
  ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', now() - interval '6 days'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', now() - interval '4 days'),
  ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', now() - interval '2 days'),
  ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', now() - interval '1 days');

-- Insert saves
INSERT INTO social.saves (save_id, user_id, post_id, saved_at)
VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', now() - interval '6 days'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', now() - interval '2 days');

-- Insert follows (social graph)
INSERT INTO social.following (id, follower_id, followee_id, followed_at)
VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', now() - interval '30 days'),
  ('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', now() - interval '20 days'),
  ('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', now() - interval '15 days'),
  ('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', now() - interval '10 days');

-- ==================== ITEMS_D SCHEMA ====================

-- Insert items metadata
INSERT INTO items_d.items (item_id, user_id, sql_id, title, description, category, monetization_type, price, visibility, availability, created_at)
VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'mongo_item_001', 'Urban Landscape Digital Art', 'High-res digital illustration pack with 5 beautiful urban scenes', 'illustration', 'paid', 29.99, 'public', true, now() - interval '60 days'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'mongo_item_002', 'The Last Horizon - Full Novel', 'Epic science fiction novel (250k words) - First in series', 'writing', 'paid', 9.99, 'public', true, now() - interval '45 days'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'mongo_item_003', 'Writing Masterclass Bundle', 'Complete course: Character development, plotting, world-building', 'writing', 'subscription', 19.99, 'public', true, now() - interval '30 days'),
  ('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'mongo_item_004', 'Web Dev Toolkit - 50 Code Snippets', 'Ready-to-use React/Node.js snippets and utilities', 'code', 'paid', 14.99, 'public', true, now() - interval '20 days'),
  ('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', 'mongo_item_005', 'Ambient Music Production Pack', 'Royalty-free loops and samples for ambient/downtempo production', 'audio', 'free', 0, 'public', true, now() - interval '15 days'),
  ('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'mongo_item_006', 'Design System Template', 'Complete Figma design system with 200+ components', 'illustration', 'paid', 49.99, 'public', true, now() - interval '10 days');

-- Insert monetization info
INSERT INTO items_d.monetization (monetization_id, item_id, type, price, currency, created_at)
VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'one_time', 29.99, 'USD', now()),
  ('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'one_time', 9.99, 'USD', now()),
  ('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'subscription', 19.99, 'USD', now()),
  ('aa0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440004', 'one_time', 14.99, 'USD', now()),
  ('aa0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440005', 'free', 0, 'USD', now()),
  ('aa0e8400-e29b-41d4-a716-446655440006', '990e8400-e29b-41d4-a716-446655440006', 'one_time', 49.99, 'USD', now());

-- Insert favorites
INSERT INTO items_d.favorites (favorite_id, user_id, item_id, created_at)
VALUES
  ('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', now() - interval '30 days'),
  ('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440005', now() - interval '15 days'),
  ('bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440004', now() - interval '10 days');

-- Insert reviews
INSERT INTO items_d.reviews (review_id, user_id, item_id, rating, review_text, created_at)
VALUES
  ('cc0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', 5, 'Absolutely incredible story! Kept me engaged from start to finish.', now() - interval '20 days'),
  ('cc0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440002', 5, 'This novel is a masterpiece. Best sci-fi read this year!', now() - interval '15 days'),
  ('cc0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440004', 4, 'Great code snippets, saved me a lot of time on my project.', now() - interval '5 days');

-- Insert transactions
INSERT INTO items_d.transactions (transaction_id, buyer_id, item_id, amount, payment_status, transaction_date)
VALUES
  ('dd0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', 9.99, 'completed', now() - interval '25 days'),
  ('dd0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440005', 0, 'completed', now() - interval '15 days'),
  ('dd0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440004', 14.99, 'completed', now() - interval '8 days'),
  ('dd0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 29.99, 'completed', now() - interval '5 days');

COMMIT;
