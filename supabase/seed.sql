-- ============================================================================
-- GM Wellness Ops — sample catalog (optional)
-- Run AFTER schema.sql if you want the shop pre-filled with example coffees
-- and supplies. Skip it to start empty. Safe to run once.
-- ============================================================================

insert into public.ingredients (name, category, unit, packet_size, coffees_per_packet, stock, par) values
  ('Arabica Beans',    'Beans',       'g',   1000, 55,  4200, 8000),
  ('Robusta Beans',    'Beans',       'g',   1000, 55,   900, 6000),
  ('Decaf Beans',      'Beans',       'g',    500, 27,  1300, 3000),
  ('Whole Milk',       'Milk',        'ml',  1000,  6,  5200, 12000),
  ('Oat Milk',         'Milk',        'ml',  1000,  6,   700, 6000),
  ('Chocolate Powder', 'Extras',      'g',   1000,100,   300, 2000),
  ('Sugar Sachets',    'Consumables', 'pcs', 1000,1000, 2600, 6000),
  ('Wooden Stirrers',  'Consumables', 'pcs', 1000,1000, 5200, 6000),
  ('Paper Cups 12oz',  'Consumables', 'pcs',  500, 500, 2100, 4000);

insert into public.products (name, price) values
  ('Espresso',    120),
  ('Americano',   150),
  ('Latte',       220),
  ('Cappuccino',  200),
  ('Flat White',  200),
  ('Oat Latte',   260),
  ('Mocha',       280),
  ('Decaf Latte', 240);

-- Recipes: (product, ingredient, qty-per-cup)
insert into public.recipe_items (product_id, ingredient_id, qty)
select p.id, i.id, v.qty
from (values
  ('Espresso','Arabica Beans',18),('Espresso','Paper Cups 12oz',1),
  ('Americano','Robusta Beans',18),('Americano','Paper Cups 12oz',1),
  ('Latte','Arabica Beans',18),('Latte','Whole Milk',150),('Latte','Paper Cups 12oz',1),('Latte','Sugar Sachets',1),('Latte','Wooden Stirrers',1),
  ('Cappuccino','Arabica Beans',18),('Cappuccino','Whole Milk',120),('Cappuccino','Paper Cups 12oz',1),('Cappuccino','Wooden Stirrers',1),
  ('Flat White','Arabica Beans',18),('Flat White','Whole Milk',110),('Flat White','Paper Cups 12oz',1),
  ('Oat Latte','Arabica Beans',18),('Oat Latte','Oat Milk',150),('Oat Latte','Paper Cups 12oz',1),('Oat Latte','Wooden Stirrers',1),
  ('Mocha','Arabica Beans',18),('Mocha','Whole Milk',120),('Mocha','Chocolate Powder',10),('Mocha','Paper Cups 12oz',1),('Mocha','Sugar Sachets',1),('Mocha','Wooden Stirrers',1),
  ('Decaf Latte','Decaf Beans',18),('Decaf Latte','Whole Milk',150),('Decaf Latte','Paper Cups 12oz',1)
) as v(product, ingredient, qty)
join public.products p    on p.name = v.product
join public.ingredients i on i.name = v.ingredient;

update public.shop_settings set shop_name = 'GM Wellness', currency = 'INR' where id = 1;
