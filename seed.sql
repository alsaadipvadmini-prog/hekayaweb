-- ==============================================================================
-- Hekaiah Outlet (حكاية للتصفية) - Supabase Complete Database Schema & Seed
-- Children's Clothing & Family Fashion Store Catalog (300 Items)
-- Executable directly in Supabase SQL Editor
-- ==============================================================================

-- 1. Ensure UUID Extension is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create products table with UUID primary key
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category TEXT NOT NULL,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Row Level Security Policy: Grant public read access (SELECT) for all users
DROP POLICY IF EXISTS "Allow public read access" ON public.products;
CREATE POLICY "Allow public read access"
    ON public.products
    FOR SELECT
    USING (true);

-- 5. Complete Inventory Population: Insert all 300 children's clothing catalog items
-- Deterministic UUIDs generated via uuid_generate_v5 ensure safe, repeatable execution
INSERT INTO public.products (id, name, description, price, category, image_url, stock, created_at)
SELECT
    uuid_generate_v5(uuid_ns_url(), 'https://hekaiah-outlet.jo/products/' || i) AS id,
    CASE 
      -- Categories: 1-60: baby (مواليد ورضع), 61-120: boys (ولادي), 121-180: girls (بناتي), 181-240: shoes (أحذية أطفال), 241-300: sets (أطقم وتصفيات)
      WHEN i <= 60 THEN (ARRAY[
        'طقم سالوبيت مواليد قطن عضوي ناعم 3 قطع',
        'مدس أطفال شتوي مبطن بالفرو الناعم الدافئ',
        'طقم استقبال مواليد ملكي فاخر مطرز بالحرير',
        'أفارول مواليد شتوي مبطن بكابيشون أذن الدب',
        'رومبر قطني صيفي خفيف ومريح للأطفال الرضع',
        'طقم كوافيل قطن موسلين طبيعي ناعم 3 قطع',
        'بيجاما نوم مواليد بسحاب ذكي ثنائي الاتجاه',
        'كيس نوم أطفال رضّع بديل للبطانية دافئ',
        'طقم ملابس داخلية قطنية لحديثي الولادة 5 قطع',
        'جاكيت بيبي محبوك دافئ مع أزرار خشبية',
        'فستان بيبي بناتي كروشيه مصنوع باليد للمناسبات',
        'طقم قبعات وقفازات قطنية لحماية حديثي الولادة'
      ])[(i % 12) + 1] || ' (موديل ' || i || ')'
      WHEN i <= 120 THEN (ARRAY[
        'طقم ولادي قطعتين قميص كتان وشورت كاجوال',
        'هودي أولاد كارتوني مبطن دافئ كولكشن حكاية',
        'بنطال جينز أطفال مطاطي مريح ومقاوم للاحتكاك',
        'جاكيت أطفال ووتربروف شتوي مقاوم للمطر والرياح',
        'تيشيرت ولادي قطن مصري 100% بألوان صيفية حيوية',
        'سروال رياضي أطفال جوغر مريح للأنشطة واللعب',
        'طقم ولادي رسمي بليزر وبنطال للأعياد والمناسبات',
        'قميص بولو ولادي قطن مخطط مع ياقة رسمية مرتبة',
        'سروال سالوبيت ولادي جينز عملي بحمالات قابلة للتعديل',
        'سويتر صوف تريكو للأطفال ناعم لا يسبب الحكة',
        'شورت ولادي كارجو بجيوب جانبية متينة للرحلات',
        'قميص ولادي كاجوال مربعات ملونة خامة قطنية سهلة الكي'
      ])[(i % 12) + 1] || ' (موديل ' || i || ')'
      WHEN i <= 180 THEN (ARRAY[
        'فستان بناتي تل فاخر منقوش بزهور ربيعية مبهجة',
        'تنورة بناتي بليسيه مع حزام فيونكة كشخة للمناسبات',
        'كارديجان بناتي صوف ناعم بأزرار لؤلؤية راقية',
        'فستان بناتي قطن صيفي كشكش ناعم ومريح للحركة',
        'معطف بناتي صوف بياقة فرو ناعمة وأزرار مزدوجة',
        'بلوزة بناتي صوف خفيف بياقة دانتيل فرنسي رقيق',
        'فستان بناتي جينز كاجوال يومي للزيارات والطلعات',
        'جمبسوت بناتي صيفي بطبعات فراشات زاهية وأنيقة',
        'طقم بناتي قطعتين توب وشورت بألوان باستيل هادئة',
        'فستان سهرة بناتي منفوش للأعراس والمناسبات السعيدة',
        'طقم بيجاما بناتي قطن سوفت برسومات ممتعة للنوم',
        'جاكيت جينز بناتي مطرز بالورود الربيعية الملونة'
      ])[(i % 12) + 1] || ' (موديل ' || i || ')'
      WHEN i <= 240 THEN (ARRAY[
        'سنيكرز أطفال بإضاءة ليد ذكية تضيء عند المشي',
        'حذاء رياضي مدرسي بشريط لاصق فيلكرو سهل اللبس',
        'حذاء باليرينا بناتي برّاق للحفلات مع بكلة لؤلؤ',
        'صندل صيفي أطفال بنعل طبي مرن مانع للانزلاق',
        'بوت مطري للأطفال بألوان ورسومات كرتونية مقاوم للماء',
        'حذاء رسمي ولادي كلاسيك جلد ناعم للمناسبات',
        'سنيكرز قماش كانفاس أطفال خفيف الوزن قابل للغسل',
        'بوت شتوي أطفال مبطن بالصوف الدافئ ومقاوم للثلج',
        'سليبر منزلي أطفال بشكل حيوانات لطيفة وفراء دافئ',
        'صندل بناتي مزين بزهور ملونة ونعل مريح جداً',
        'حذاء كاجوال ولادي بدون أربطة سليب أون مرن',
        'صندل مائي للأطفال للشاطئ والمسبح سريع الجفاف'
      ])[(i % 12) + 1] || ' (موديل ' || i || ')'
      ELSE (ARRAY[
        'طقم أطفال متناسق هودي وبنطال تصفية الموسم',
        'بكج ملابس أطفال داخلي قطن نقي 6 قطع بسعر خاص',
        'جاكيت بافر أطفال شتوي مبطن تصفية حكاية أوتلت',
        'طقم بيجاما عائلي شتوي مخمل دافئ عروض تصفية',
        'أوفرول أطفال خريفي قطن مبطن تشكيلة التصفية',
        'سنيكرز رياضي مرن للأولاد والبنات تصفية نهاية الموسم',
        'فستان أطفال موسمي خفيف تصفية حكاية الكبرى',
        'طقم مواليد كامل 8 قطع بشنطة فاخرة عرض تصفية',
        'معطف مطري خفيف للأطفال بألوان فسفورية مميزة',
        'شورت جينز بناتي وأولادي قطن مطاطي سعر خاص',
        'طقم كنزات قطن خريفية للأطفال قطعتين بسعر مخفض',
        'سليبر صيفي مريح خفيف للأطفال عرض خاص بالتصفية'
      ])[(i % 12) + 1] || ' (موديل ' || i || ')'
    END AS name,
    'منتج أصلي عالي الجودة من تشكيلة حكاية أوتلت (حكاية للتصفية). نسيج قطني ناعم وصحي 100% مناسب لبشرة الأطفال الحساسة مع خياطة متينة ومريحة للحركة طوال اليوم.' AS description,
    ROUND((6.00 + ((i * 13) % 38) + 0.50)::numeric, 2) AS price,
    CASE 
      WHEN i <= 60 THEN 'baby'
      WHEN i <= 120 THEN 'boys'
      WHEN i <= 180 THEN 'girls'
      WHEN i <= 240 THEN 'shoes'
      ELSE 'sets'
    END AS category,
    CASE 
      WHEN i <= 60 THEN (ARRAY[
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80'
      ])[(i % 3) + 1]
      WHEN i <= 120 THEN (ARRAY[
        'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1471286174890-9c112ffca56a?w=800&auto=format&fit=crop&q=80'
      ])[(i % 3) + 1]
      WHEN i <= 180 THEN (ARRAY[
        'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80'
      ])[(i % 3) + 1]
      WHEN i <= 240 THEN (ARRAY[
        'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'
      ])[(i % 3) + 1]
      ELSE (ARRAY[
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80'
      ])[(i % 3) + 1]
    END AS image_url,
    ((i * 11) % 45 + 5)::integer AS stock,
    timezone('utc'::text, now()) AS created_at
FROM generate_series(1, 300) AS i
ON CONFLICT (id) DO UPDATE 
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    image_url = EXCLUDED.image_url,
    stock = EXCLUDED.stock;