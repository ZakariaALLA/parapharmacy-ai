-- =============================================
-- ParaPharma Maroc - Seed Data
-- =============================================

-- Admin user (password: admin123)
INSERT INTO users (email, password, full_name, phone, role, created_at)
SELECT 'admin@parapharma.ma', '$2a$10$gBe0DIowxpmQ1nDYuSvbU.hai6SZWTeKHQh7kk6KcFvkvrVAvSQNe', 'Admin ParaPharma', '+212600000000', 'ADMIN', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@parapharma.ma');

-- Test user (password: user123)
INSERT INTO users (email, password, full_name, phone, role, created_at)
SELECT 'user@test.ma', '$2a$10$hashedPasswordForUser123456789012345678901234', 'Fatima Zahra', '+212612345678', 'USER', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user@test.ma');

-- Categories
INSERT INTO categories (name, slug, description, image_url)
SELECT 'Dermo-Cosmétiques', 'dermo-cosmetiques', 'Soins dermatologiques et cosmétiques pour tous types de peau', '/assets/images/categories/dermo-cosmetiques.jpg'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'dermo-cosmetiques');

INSERT INTO categories (name, slug, description, image_url)
SELECT 'Compléments Alimentaires', 'complements-alimentaires', 'Vitamines, minéraux et compléments pour votre bien-être', '/assets/images/categories/complements-alimentaires.jpg'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'complements-alimentaires');

INSERT INTO categories (name, slug, description, image_url)
SELECT 'Hygiène', 'hygiene', 'Produits d''hygiène corporelle et bucco-dentaire', '/assets/images/categories/hygiene.jpg'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'hygiene');

INSERT INTO categories (name, slug, description, image_url)
SELECT 'Soins Bébé', 'soins-bebe', 'Soins et hygiène pour bébé et jeune enfant', '/assets/images/categories/soins-bebe.jpg'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'soins-bebe');

INSERT INTO categories (name, slug, description, image_url)
SELECT 'Soins de la Peau', 'soins-de-la-peau', 'Crèmes, sérums et soins pour une peau saine et éclatante', '/assets/images/categories/soins-de-la-peau.jpg'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'soins-de-la-peau');

-- Products: Dermo-Cosmétiques (category_id = 1)
INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Eau Thermale Avène Spray 300ml', 'eau-thermale-avene-spray-300ml', 120.00, 4.7,
'Eau thermale apaisante et anti-irritante. Spray brumisateur pour le visage et le corps. Eau pure et douce, directement captée à la source.',
'Vaporiser sur le visage à 20 cm de distance. Laisser agir 2-3 minutes puis tamponner délicatement. Utiliser après le nettoyage et avant l''application de crème.',
'Avène', 1, 50, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'eau-thermale-avene-spray-300ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'La Roche-Posay Effaclar Duo+ 40ml', 'la-roche-posay-effaclar-duo-40ml', 195.00, 4.8,
'Soin anti-imperfections. Action anti-marques. Correcteur désincrustant. Peaux grasses à tendance acnéique.',
'Appliquer matin et soir sur l''ensemble du visage après nettoyage. Éviter le contour des yeux. Peut être utilisé comme base de maquillage.',
'La Roche-Posay', 1, 35, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'la-roche-posay-effaclar-duo-40ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Bioderma Sensibio H2O 500ml', 'bioderma-sensibio-h2o-500ml', 175.00, 4.9,
'Eau micellaire démaquillante pour peaux sensibles. Nettoie, démaquille et apaise. Sans rinçage. Haute tolérance.',
'Imbiber un coton et nettoyer le visage, les yeux et les lèvres. Pas besoin de rincer. Utiliser matin et soir.',
'Bioderma', 1, 60, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bioderma-sensibio-h2o-500ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Vichy Minéral 89 Sérum 50ml', 'vichy-mineral-89-serum-50ml', 280.00, 4.6,
'Sérum fortifiant et repulpant. Enrichi en acide hyaluronique et eau minéralisante de Vichy. Boost d''hydratation quotidien.',
'Appliquer 2 doses chaque matin sur le visage avant votre crème de jour. Convient à tous les types de peau.',
'Vichy', 1, 25, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'vichy-mineral-89-serum-50ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Nuxe Huile Prodigieuse 100ml', 'nuxe-huile-prodigieuse-100ml', 220.00, 4.5,
'Huile sèche multi-fonctions visage, corps et cheveux. Nourrit, répare et sublime. Formule aux huiles précieuses végétales.',
'Appliquer sur le corps, le visage ou les cheveux. Peut être utilisée avant ou après le bain. Masser pour faire pénétrer.',
'Nuxe', 1, 40, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'nuxe-huile-prodigieuse-100ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'CeraVe Crème Hydratante 340g', 'cerave-creme-hydratante-340g', 165.00, 4.7,
'Crème hydratante pour le visage et le corps. Avec 3 céramides essentiels et acide hyaluronique. Développée avec des dermatologues.',
'Appliquer sur le visage et/ou le corps aussi souvent que nécessaire. Convient aux peaux sèches à très sèches.',
'CeraVe', 1, 45, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cerave-creme-hydratante-340g');

-- Products: Compléments Alimentaires (category_id = 2)
INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Vitamine C 1000mg - 30 comprimés', 'vitamine-c-1000mg-30-comprimes', 89.00, 4.5,
'Complément alimentaire en vitamine C haute dose. Renforce les défenses immunitaires. Action antioxydante puissante.',
'Prendre 1 comprimé par jour avec un verre d''eau, de préférence le matin au petit-déjeuner. Ne pas dépasser la dose recommandée.',
'Aragan', 2, 100, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'vitamine-c-1000mg-30-comprimes');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Magnésium Marin B6 - 40 gélules', 'magnesium-marin-b6-40-gelules', 75.00, 4.3,
'Magnésium d''origine marine associé à la vitamine B6. Contribue à réduire la fatigue et le stress. Aide au bon fonctionnement du système nerveux.',
'Prendre 2 gélules par jour avec un grand verre d''eau pendant le repas. Cure de 20 jours renouvelable.',
'Biocyte', 2, 80, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'magnesium-marin-b6-40-gelules');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Vitamine D3 2000UI - 90 capsules', 'vitamine-d3-2000ui-90-capsules', 110.00, 4.6,
'Vitamine D3 d''origine végétale. Contribue au maintien d''une ossature normale. Soutient le système immunitaire.',
'Prendre 1 capsule par jour pendant le repas. La supplémentation est recommandée surtout en période hivernale.',
'D Plantes', 2, 55, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'vitamine-d3-2000ui-90-capsules');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Oméga 3 EPA DHA - 60 capsules', 'omega-3-epa-dha-60-capsules', 145.00, 4.4,
'Huile de poisson riche en EPA et DHA. Contribue au bon fonctionnement cardiovasculaire. Soutient les fonctions cérébrales.',
'Prendre 2 capsules par jour au cours du repas avec un verre d''eau. Cure recommandée de 2 mois.',
'Effinov', 2, 40, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'omega-3-epa-dha-60-capsules');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Probiotiques Flore Intestinale - 30 gélules', 'probiotiques-flore-intestinale-30-gelules', 135.00, 4.2,
'Complexe de probiotiques avec 10 milliards de ferments lactiques. Restaure et maintient l''équilibre de la flore intestinale.',
'Prendre 1 gélule par jour le matin à jeun avec un verre d''eau. Cure de 30 jours.',
'Biocodex', 2, 30, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'probiotiques-flore-intestinale-30-gelules');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Fer + Acide Folique - 30 comprimés', 'fer-acide-folique-30-comprimes', 65.00, 4.1,
'Association de fer et d''acide folique. Idéal pour les femmes enceintes et les personnes carencées. Contribue à la formation normale des globules rouges.',
'Prendre 1 comprimé par jour avec un verre de jus d''orange pour favoriser l''absorption. Éviter le thé et le café.',
'Densmore', 2, 70, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'fer-acide-folique-30-comprimes');

-- Products: Hygiène (category_id = 3)
INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Gel Douche Surgras SVR 400ml', 'gel-douche-surgras-svr-400ml', 95.00, 4.3,
'Gel douche surgras sans savon pour peaux sensibles et sèches. Nettoie en douceur tout en respectant le film hydrolipidique.',
'Appliquer sous la douche sur peau mouillée, faire mousser puis rincer abondamment. Usage quotidien.',
'SVR', 3, 55, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'gel-douche-surgras-svr-400ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Dentifrice Elmex Anti-Caries 75ml', 'dentifrice-elmex-anti-caries-75ml', 45.00, 4.5,
'Protection efficace contre les caries. Fluorure d''amines Olafluor. Reminéralise l''émail et protège les dents.',
'Se brosser les dents 2 fois par jour pendant 2 minutes. Ne pas avaler. Pour adultes et enfants de plus de 6 ans.',
'Elmex', 3, 90, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'dentifrice-elmex-anti-caries-75ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Déodorant Pierre d''Alun Naturelle', 'deodorant-pierre-alun-naturelle', 55.00, 4.0,
'Déodorant 100% naturel en pierre d''alun. Sans alcool, sans paraben, sans sel d''aluminium. Efficacité 24h.',
'Humidifier la pierre et appliquer sur les aisselles propres et sèches. Laisser sécher naturellement.',
'Propos Nature', 3, 65, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'deodorant-pierre-alun-naturelle');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Shampooing Antipelliculaire Ducray 200ml', 'shampooing-antipelliculaire-ducray-200ml', 130.00, 4.4,
'Shampooing traitant antipelliculaire pour cuir chevelu à tendance grasse. Élimine les pellicules dès la première utilisation.',
'Appliquer sur cheveux mouillés, masser le cuir chevelu et laisser agir 3 minutes. Rincer. Utiliser 2-3 fois par semaine.',
'Ducray', 3, 35, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'shampooing-antipelliculaire-ducray-200ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Bain de Bouche Eludril 500ml', 'bain-de-bouche-eludril-500ml', 78.00, 4.2,
'Solution pour bain de bouche antiseptique. Traitement d''appoint des infections buccales. Action antibactérienne.',
'Diluer 10 à 15 ml dans un demi-verre d''eau tiède. Rincer la bouche pendant 30 secondes. Ne pas avaler. 2-3 fois par jour.',
'Pierre Fabre', 3, 45, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bain-de-bouche-eludril-500ml');

-- Products: Soins Bébé (category_id = 4)
INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Mustela Gel Lavant Doux 500ml', 'mustela-gel-lavant-doux-500ml', 110.00, 4.8,
'Gel lavant doux pour bébé. Nettoie en douceur la peau et les cheveux. Formule biodégradable à 95%. Haute tolérance dès la naissance.',
'Appliquer sur la peau mouillée du bébé, faire mousser délicatement puis rincer. Usage quotidien dès la naissance.',
'Mustela', 4, 50, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mustela-gel-lavant-doux-500ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Bébisol Crème de Change 100ml', 'bebisol-creme-de-change-100ml', 65.00, 4.3,
'Crème protectrice pour le change. Apaise et protège les fesses de bébé. Effet barrière contre les irritations.',
'Appliquer à chaque change sur peau propre et sèche. Étaler en couche épaisse sur les zones irritées.',
'Gilbert', 4, 70, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bebisol-creme-de-change-100ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Sérum Physiologique Gifrer 40 doses', 'serum-physiologique-gifrer-40-doses', 42.00, 4.6,
'Sérum physiologique en doses uniques stériles. Nettoyage du nez et des yeux de bébé. Solution isotonique de chlorure de sodium.',
'Instiller 1 à 2 doses dans chaque narine ou œil. Utiliser une dose par nettoyage. À partir de la naissance.',
'Gifrer', 4, 120, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'serum-physiologique-gifrer-40-doses');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Biolane Eau de Toilette Fraîcheur 200ml', 'biolane-eau-de-toilette-fraicheur-200ml', 85.00, 4.1,
'Eau de toilette douce et fraîche pour bébé. Sans alcool. Formule hypoallergénique testée sous contrôle dermatologique.',
'Vaporiser sur les vêtements ou sur la peau du bébé. Éviter le visage et les zones sensibles. Dès 3 mois.',
'Biolane', 4, 40, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'biolane-eau-de-toilette-fraicheur-200ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Pediakid Vitamine D3 20ml', 'pediakid-vitamine-d3-20ml', 95.00, 4.5,
'Vitamine D3 pour nourrissons et enfants. Contribue à la croissance osseuse normale. Formulé à base de vitamine D3 d''origine naturelle.',
'1 goutte par jour à mettre directement dans la bouche ou dans le biberon. Dès la naissance, sur avis médical.',
'Pediakid', 4, 55, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pediakid-vitamine-d3-20ml');

-- Products: Soins de la Peau (category_id = 5)
INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'SVR Sebiaclear Sérum 30ml', 'svr-sebiaclear-serum-30ml', 185.00, 4.5,
'Sérum correcteur anti-imperfections. Action sur les boutons, points noirs et pores dilatés. Résultats visibles dès 7 jours.',
'Appliquer matin et soir sur le visage propre en évitant le contour des yeux. Laisser pénétrer avant d''appliquer votre crème.',
'SVR', 5, 30, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'svr-sebiaclear-serum-30ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Uriage Bariéderm Cica-Crème 40ml', 'uriage-bariederm-cica-creme-40ml', 140.00, 4.4,
'Crème réparatrice au cuivre et zinc. Répare et protège les peaux fragilisées et irritées. Texture riche et protectrice.',
'Appliquer 2 fois par jour sur les zones fragilisées. Masser délicatement. Convient au visage et au corps.',
'Uriage', 5, 25, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'uriage-bariederm-cica-creme-40ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Eucerin Hyaluron-Filler Crème de Jour 50ml', 'eucerin-hyaluron-filler-creme-jour-50ml', 310.00, 4.7,
'Soin anti-rides combleur de rides. Enrichi en acide hyaluronique concentré. Réduit visiblement la profondeur des rides.',
'Appliquer chaque matin sur le visage et le cou après nettoyage. Masser délicatement pour faire pénétrer.',
'Eucerin', 5, 20, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'eucerin-hyaluron-filler-creme-jour-50ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Noreva Exfoliac Global 6 30ml', 'noreva-exfoliac-global-6-30ml', 155.00, 4.3,
'Soin global haute tolérance pour peaux à imperfections. 6 actions ciblées : anti-boutons, anti-marques, anti-pores dilatés.',
'Appliquer matin et soir sur le visage propre. Éviter le contour des yeux et des lèvres.',
'Noreva', 5, 35, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'noreva-exfoliac-global-6-30ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Avène Tolérance Extrême Crème 50ml', 'avene-tolerance-extreme-creme-50ml', 198.00, 4.6,
'Crème apaisante pour peaux hypersensibles et allergiques. Formule stérile ultra-minimaliste. Texture légère et fondante.',
'Appliquer matin et soir sur le visage et le cou. Idéale pour les peaux réactives et intolérantes.',
'Avène', 5, 8, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'avene-tolerance-extreme-creme-50ml');

INSERT INTO products (title, slug, price, rating, description, usage_tips, manufacturer, category_id, stock_quantity, active, created_at, updated_at)
SELECT 'Bioderma Photoderm MAX Crème SPF50+ 40ml', 'bioderma-photoderm-max-creme-spf50-40ml', 145.00, 4.8,
'Protection solaire très haute pour peaux sensibles. Prévient les dommages cellulaires liés aux UV. Texture légère invisible.',
'Appliquer généreusement avant l''exposition solaire. Renouveler l''application toutes les 2 heures et après chaque baignade.',
'Bioderma', 5, 5, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bioderma-photoderm-max-creme-spf50-40ml');

-- Product Images
INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500', 0, true
FROM products p WHERE p.slug = 'eau-thermale-avene-spray-300ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 0, true
FROM products p WHERE p.slug = 'la-roche-posay-effaclar-duo-40ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500', 0, true
FROM products p WHERE p.slug = 'bioderma-sensibio-h2o-500ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=500', 0, true
FROM products p WHERE p.slug = 'vichy-mineral-89-serum-50ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500', 0, true
FROM products p WHERE p.slug = 'nuxe-huile-prodigieuse-100ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', 0, true
FROM products p WHERE p.slug = 'cerave-creme-hydratante-340g'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', 0, true
FROM products p WHERE p.slug = 'vitamine-c-1000mg-30-comprimes'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=500', 0, true
FROM products p WHERE p.slug = 'magnesium-marin-b6-40-gelules'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', 0, true
FROM products p WHERE p.slug = 'vitamine-d3-2000ui-90-capsules'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=500', 0, true
FROM products p WHERE p.slug = 'omega-3-epa-dha-60-capsules'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500', 0, true
FROM products p WHERE p.slug = 'probiotiques-flore-intestinale-30-gelules'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1585435557343-3b348031f0b5?w=500', 0, true
FROM products p WHERE p.slug = 'fer-acide-folique-30-comprimes'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 0, true
FROM products p WHERE p.slug = 'gel-douche-surgras-svr-400ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1559589689-577aabd1db4f?w=500', 0, true
FROM products p WHERE p.slug = 'dentifrice-elmex-anti-caries-75ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500', 0, true
FROM products p WHERE p.slug = 'deodorant-pierre-alun-naturelle'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500', 0, true
FROM products p WHERE p.slug = 'shampooing-antipelliculaire-ducray-200ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500', 0, true
FROM products p WHERE p.slug = 'bain-de-bouche-eludril-500ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500', 0, true
FROM products p WHERE p.slug = 'mustela-gel-lavant-doux-500ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=500', 0, true
FROM products p WHERE p.slug = 'bebisol-creme-de-change-100ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=500', 0, true
FROM products p WHERE p.slug = 'serum-physiologique-gifrer-40-doses'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', 0, true
FROM products p WHERE p.slug = 'biolane-eau-de-toilette-fraicheur-200ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1631390125602-31913ec6348e?w=500', 0, true
FROM products p WHERE p.slug = 'pediakid-vitamine-d3-20ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500', 0, true
FROM products p WHERE p.slug = 'svr-sebiaclear-serum-30ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 0, true
FROM products p WHERE p.slug = 'uriage-bariederm-cica-creme-40ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500', 0, true
FROM products p WHERE p.slug = 'eucerin-hyaluron-filler-creme-jour-50ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', 0, true
FROM products p WHERE p.slug = 'noreva-exfoliac-global-6-30ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=500', 0, true
FROM products p WHERE p.slug = 'avene-tolerance-extreme-creme-50ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, image_url, display_order, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1532413992378-f169ac26fff0?w=500', 0, true
FROM products p WHERE p.slug = 'bioderma-photoderm-max-creme-spf50-40ml'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);
