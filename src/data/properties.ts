export interface FurnitureItem {
  id: string;
  name: string;
  type: 'bed' | 'sofa' | 'table' | 'chair' | 'wardrobe' | 'cabinet' | 'fixture';
  x: number; // percentage from left
  y: number; // percentage from top
  w: number; // width percentage
  h: number; // height percentage
}

export interface Hotspot {
  id: string;
  label: string;
  details: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
  specifications: Record<string, string>; // style-specific details
}

export interface Room {
  id: string;
  name: string;
  dimensions: string;
  areaSqFt: number;
  x: number; // floor grid layout x
  y: number; // floor grid layout y
  w: number; // floor grid layout width
  h: number; // floor grid layout height
  hotspots: Hotspot[];
  furniture: Record<string, FurnitureItem[]>; // Keyed by interior style
}

export interface Property {
  id: string;
  name: string;
  type: 'apartment' | 'villa' | 'commercial';
  description: string;
  price: string;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rooms: Room[];
  has3DModel?: boolean;
  modelUrl?: string;
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'emerald-bay',
    name: 'Emerald Bay Suite',
    type: 'apartment',
    description: 'A luxurious 2 BHK water-facing apartment featuring modern smart-home integrations and premium finishes throughout.',
    price: '$650,000',
    location: 'Marina District, Sector 4',
    area: '1,450 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Infinity Pool', 'Smart Home Control', '24/7 Concierge', 'EV Charging Station', 'Private Deck'],
    has3DModel: true,
    modelUrl: '/models/emerald-bay.ply',
    rooms: [
      {
        id: 'living',
        name: 'Living Room',
        dimensions: '18ft x 14ft',
        areaSqFt: 252,
        x: 0, y: 0, w: 60, h: 50,
        hotspots: [
          {
            id: 'l-hs1',
            label: 'Primary Lounge Area',
            details: 'Spacious central seating designed for maximum comfort and dynamic viewing angles.',
            x: 50, y: 50,
            specifications: {
              modern: 'Low-profile charcoal modular sofa, charcoal wool rug, oak media unit.',
              luxury: 'Plush velvet emerald sofa with brushed-gold brass legs, white marble tables.',
              minimalist: 'Cream linen Japanese-futon sofa, natural jute rug, wall-recessed shelves.',
              scandinavian: 'Light grey wool sofa with wooden legs, pastel yellow cushions, light oak table.',
              contemporary: 'Asymmetric leather sectional, black steel abstract coffee table, bold geometric rug.',
              indian: 'Intricately carved teakwood swing (jhoola) and sofa, copper lighting, terracotta carpet.'
            }
          },
          {
            id: 'l-hs2',
            label: 'Panoramic Window Panel',
            details: 'Floor-to-ceiling glass offering uninterrupted views of the bay.',
            x: 80, y: 15,
            specifications: {
              modern: 'Double-glazed solar-tinted glass, motorized charcoal valence blinds.',
              luxury: 'Crystal-clear glass panels, gold-trimmed velvet drapes, marble window ledges.',
              minimalist: 'Ultra-thin white bezel windows, linen drop screens.',
              scandinavian: 'Light pine wood window framing, sheer white linen curtains.',
              contemporary: 'Matte black architectural frame, automated drop blinds.',
              indian: 'Ornate arched teak wood valence panels, cotton block-printed curtains.'
            }
          }
        ],
        furniture: {
          modern: [
            { id: 'l-f1', name: 'Modular Sectional Sofa', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'l-f2', name: 'Oak Coffee Table', type: 'table', x: 35, y: 30, w: 25, h: 10 },
            { id: 'l-f3', name: 'Smart Media Console', type: 'cabinet', x: 35, y: 5, w: 30, h: 8 }
          ],
          luxury: [
            { id: 'l-f1', name: 'Plush Emerald Chesterfield', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'l-f2', name: 'Gold & Marble Coffee Table', type: 'table', x: 35, y: 30, w: 25, h: 10 },
            { id: 'l-f3', name: 'Brass Accent Console', type: 'cabinet', x: 35, y: 5, w: 30, h: 8 }
          ],
          minimalist: [
            { id: 'l-f1', name: 'Cream Linen Bench Sofa', type: 'sofa', x: 30, y: 48, w: 35, h: 20 },
            { id: 'l-f2', name: 'Monolithic Stone Block Table', type: 'table', x: 38, y: 32, w: 20, h: 8 },
            { id: 'l-f3', name: 'Invisible Floating Ledge', type: 'cabinet', x: 35, y: 5, w: 28, h: 5 }
          ],
          scandinavian: [
            { id: 'l-f1', name: 'Light Grey Wool Sofa', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'l-f2', name: 'Natural Birch Wood Table', type: 'table', x: 35, y: 30, w: 25, h: 10 },
            { id: 'l-f3', name: 'White Ash TV Board', type: 'cabinet', x: 35, y: 5, w: 30, h: 8 }
          ],
          contemporary: [
            { id: 'l-f1', name: 'Asymmetric Leather Sectional', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'l-f2', name: 'Black Steel Geometric Table', type: 'table', x: 35, y: 30, w: 25, h: 10 },
            { id: 'l-f3', name: 'Charcoal Matte Credenza', type: 'cabinet', x: 35, y: 5, w: 30, h: 8 }
          ],
          indian: [
            { id: 'l-f1', name: 'Teakwood Jhoola & Sofas', type: 'sofa', x: 25, y: 45, w: 45, h: 25 },
            { id: 'l-f2', name: 'Carved Teakwood Coffee Table', type: 'table', x: 35, y: 30, w: 25, h: 10 },
            { id: 'l-f3', name: 'Intricately Engraved Credenza', type: 'cabinet', x: 35, y: 5, w: 30, h: 8 }
          ]
        }
      },
      {
        id: 'kitchen',
        name: 'Gourmet Kitchen & Dining',
        dimensions: '14ft x 12ft',
        areaSqFt: 168,
        x: 60, y: 0, w: 40, h: 50,
        hotspots: [
          {
            id: 'k-hs1',
            label: 'Preparation Island',
            details: 'Fully integrated prep counter with under-counter chiller drawer systems.',
            x: 45, y: 40,
            specifications: {
              modern: 'Matte black composite stone counter, induction stovetop.',
              luxury: 'Calacatta marble waterfall island, brass sinks & touchless gold taps.',
              minimalist: 'Seamless microcement workspace, hidden downdraft exhaust.',
              scandinavian: 'White composite quartz surface, solid oak trim drawers.',
              contemporary: 'Stainless steel industrial counter, integrated smart screens.',
              indian: 'Deep granite counter, brass spice racks, copper utensil accents.'
            }
          }
        ],
        furniture: {
          modern: [
            { id: 'k-f1', name: 'Dining Table & 4 Chairs', type: 'table', x: 15, y: 65, w: 30, h: 25 },
            { id: 'k-f2', name: 'Quartz Prep Island', type: 'table', x: 55, y: 35, w: 30, h: 25 },
            { id: 'k-f3', name: 'Matte Charcoal Cabinets', type: 'cabinet', x: 10, y: 5, w: 80, h: 10 }
          ],
          luxury: [
            { id: 'k-f1', name: 'Marble Dining Table & Velvet Chairs', type: 'table', x: 15, y: 65, w: 30, h: 25 },
            { id: 'k-f2', name: 'Calacatta Marble Island', type: 'table', x: 55, y: 35, w: 30, h: 25 },
            { id: 'k-f3', name: 'Gloss Lacquer & Gold Cabinets', type: 'cabinet', x: 10, y: 5, w: 80, h: 10 }
          ],
          minimalist: [
            { id: 'k-f1', name: 'Solid Wood Bench Dining Set', type: 'table', x: 20, y: 70, w: 25, h: 20 },
            { id: 'k-f2', name: 'Microcement Kitchen Island', type: 'table', x: 55, y: 35, w: 30, h: 25 },
            { id: 'k-f3', name: 'Seamless Handleless Cabinets', type: 'cabinet', x: 10, y: 5, w: 80, h: 8 }
          ],
          scandinavian: [
            { id: 'k-f1', name: 'White Wood Table & Wishbone Chairs', type: 'table', x: 15, y: 65, w: 30, h: 25 },
            { id: 'k-f2', name: 'Birch Waterfall Prep Island', type: 'table', x: 55, y: 35, w: 30, h: 25 },
            { id: 'k-f3', name: 'White & Wood Dual Tone Cabinets', type: 'cabinet', x: 10, y: 5, w: 80, h: 10 }
          ],
          contemporary: [
            { id: 'k-f1', name: 'Glass Dining Table & Steel Chairs', type: 'table', x: 15, y: 65, w: 30, h: 25 },
            { id: 'k-f2', name: 'Stainless Steel Chef Island', type: 'table', x: 55, y: 35, w: 30, h: 25 },
            { id: 'k-f3', name: 'Dark Ash Brushed-Metal Cabinets', type: 'cabinet', x: 10, y: 5, w: 80, h: 10 }
          ],
          indian: [
            { id: 'k-f1', name: 'Rosewood Dining Table & Cushioned Chairs', type: 'table', x: 15, y: 65, w: 30, h: 25 },
            { id: 'k-f2', name: 'Polished Granite Island', type: 'table', x: 55, y: 35, w: 30, h: 25 },
            { id: 'k-f3', name: 'Teakwood Cabinets with Brass Knobs', type: 'cabinet', x: 10, y: 5, w: 80, h: 10 }
          ]
        }
      },
      {
        id: 'bedroom',
        name: 'Master Suite',
        dimensions: '16ft x 14ft',
        areaSqFt: 224,
        x: 0, y: 50, w: 60, h: 50,
        hotspots: [
          {
            id: 'b-hs1',
            label: 'King Bed Setup',
            details: 'Featuring orthopedic mattress support, ambient headboard backlight, and integrated charge ports.',
            x: 35, y: 40,
            specifications: {
              modern: 'Low-slung grey upholstered bed frame, floating side tables, LED strip accents.',
              luxury: 'Tall tufted velvet headboard, silk duvet, crystal table lamps, gold trim nightstands.',
              minimalist: 'Low Japanese tatami wooden frame, concealed drawer nightstands, warm neutral bedding.',
              scandinavian: 'Light oak wood frame, white linen duvet, cozy wool knit throw, wooden nightstands.',
              contemporary: 'Floating platform bed, metallic grey covers, sleek circular steel night tables.',
              indian: 'Poster bed (Four-poster bed) with hand-carved pillars, block-printed cotton spreads.'
            }
          }
        ],
        furniture: {
          modern: [
            { id: 'b-f1', name: 'Upholstered King Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 },
            { id: 'b-f2', name: 'Sleek Writing Desk & Chair', type: 'table', x: 65, y: 15, w: 25, h: 20 },
            { id: 'b-f3', name: 'Sliding Mirror Wardrobe', type: 'wardrobe', x: 65, y: 55, w: 25, h: 35 }
          ],
          luxury: [
            { id: 'b-f1', name: 'Velvet Wingback King Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 },
            { id: 'b-f2', name: 'Gold-Trim Dressing Table & Stool', type: 'table', x: 65, y: 15, w: 25, h: 20 },
            { id: 'b-f3', name: 'Walk-In Glass Fitted Wardrobe', type: 'wardrobe', x: 65, y: 55, w: 25, h: 35 }
          ],
          minimalist: [
            { id: 'b-f1', name: 'Low Tatami Platform Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 },
            { id: 'b-f2', name: 'Floating Birch Desk & Stool', type: 'table', x: 65, y: 15, w: 25, h: 20 },
            { id: 'b-f3', name: 'Push-To-Open White Wardrobe', type: 'wardrobe', x: 65, y: 55, w: 25, h: 35 }
          ],
          scandinavian: [
            { id: 'b-f1', name: 'Light Birch King Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 },
            { id: 'b-f2', name: 'Oak Desk & Wishbone Chair', type: 'table', x: 65, y: 15, w: 25, h: 20 },
            { id: 'b-f3', name: 'White Ash Sliding Wardrobe', type: 'wardrobe', x: 65, y: 55, w: 25, h: 35 }
          ],
          contemporary: [
            { id: 'b-f1', name: 'Floating Charcoal King Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 },
            { id: 'b-f2', name: 'Steel Frame Study Table', type: 'table', x: 65, y: 15, w: 25, h: 20 },
            { id: 'b-f3', name: 'Tinted Mirror Wardrobe Units', type: 'wardrobe', x: 65, y: 55, w: 25, h: 35 }
          ],
          indian: [
            { id: 'b-f1', name: 'Four-Poster Rosewood Bed', type: 'bed', x: 15, y: 25, w: 40, h: 40 },
            { id: 'b-f2', name: 'Carved Wood Study Desk & Chair', type: 'table', x: 65, y: 15, w: 25, h: 20 },
            { id: 'b-f3', name: 'Ornate Solid Wood Almirah', type: 'wardrobe', x: 65, y: 55, w: 25, h: 35 }
          ]
        }
      },
      {
        id: 'bathroom',
        name: 'Ensuite Bathroom',
        dimensions: '8ft x 10ft',
        areaSqFt: 80,
        x: 60, y: 50, w: 25, h: 50,
        hotspots: [
          {
            id: 'bt-hs1',
            label: 'Wash Basin Vanity',
            details: 'Floating sink console with ceramic washbowl and LED mirror.',
            x: 50, y: 25,
            specifications: {
              modern: 'Wall-mounted dark grey concrete basin, black matte fixtures, backlit circular mirror.',
              luxury: 'Polished white marble console, gold faucets, backlit ornate gilded frame mirror.',
              minimalist: 'Corian seamless block vanity, recessed tap, natural backlighting mirror.',
              scandinavian: 'Birch counter with ceramic basin, chrome fixtures, simple oak frame mirror.',
              contemporary: 'Glass vanity, brushed steel pipes, smart mirror with touch control displays.',
              indian: 'Terracotta tile wash counter, hammered brass basin, copper light fixtures.'
            }
          }
        ],
        furniture: {
          modern: [{ id: 'bt-f1', name: 'Grey Floating Vanity', type: 'fixture', x: 25, y: 20, w: 50, h: 20 }],
          luxury: [{ id: 'bt-f1', name: 'Marble & Gold Double Vanity', type: 'fixture', x: 25, y: 20, w: 50, h: 20 }],
          minimalist: [{ id: 'bt-f1', name: 'Monolithic Seamless Vanity', type: 'fixture', x: 25, y: 20, w: 50, h: 18 }],
          scandinavian: [{ id: 'bt-f1', name: 'Birch & White Washstand', type: 'fixture', x: 25, y: 20, w: 50, h: 20 }],
          contemporary: [{ id: 'bt-f1', name: 'Glass & Steel Console Sink', type: 'fixture', x: 25, y: 20, w: 50, h: 20 }],
          indian: [{ id: 'bt-f1', name: 'Carved Wood Wash Counter', type: 'fixture', x: 25, y: 20, w: 50, h: 22 }]
        }
      },
      {
        id: 'balcony',
        name: 'Private Deck',
        dimensions: '6ft x 14ft',
        areaSqFt: 84,
        x: 85, y: 50, w: 15, h: 50,
        hotspots: [
          {
            id: 'bl-hs1',
            label: 'Relaxation Decking',
            details: 'Cozy outdoor deck perfect for coffee or watching the waves.',
            x: 50, y: 50,
            specifications: {
              modern: 'Composite grey wood planks, minimalist grey wire chairs, steel drink stand.',
              luxury: 'Premium teak wood deck, white outdoor sofa, brass lanterns.',
              minimalist: 'Muted grey tiles, low stone meditation stool, single bonsai plant.',
              scandinavian: 'Light thermo-wood planks, rattan chairs, sheepskin pads, string fairy lights.',
              contemporary: 'Glass panels with black railings, futuristic egg swing chair.',
              indian: 'Terracotta tiles, colorful hand-woven jute charpai cot, brass planters.'
            }
          }
        ],
        furniture: {
          modern: [{ id: 'bl-f1', name: '2 Wire Chairs & Coffee Table', type: 'table', x: 20, y: 30, w: 60, h: 40 }],
          luxury: [{ id: 'bl-f1', name: 'Outdoor Sofa & Brass Side Table', type: 'sofa', x: 20, y: 30, w: 60, h: 40 }],
          minimalist: [{ id: 'bl-f1', name: 'Stone Stool & Bonsai Plant', type: 'table', x: 30, y: 40, w: 40, h: 30 }],
          scandinavian: [{ id: 'bl-f1', name: '2 Rattan Chairs & Wood Table', type: 'table', x: 20, y: 30, w: 60, h: 40 }],
          contemporary: [{ id: 'bl-f1', name: 'Modern Egg Swing & Metal Table', type: 'sofa', x: 20, y: 30, w: 60, h: 40 }],
          indian: [{ id: 'bl-f1', name: 'Jute Charpai Cot & Brass Planters', type: 'sofa', x: 20, y: 25, w: 60, h: 50 }]
        }
      }
    ]
  },
  {
    id: 'royal-villa',
    name: 'The Royal Villa',
    type: 'villa',
    description: 'An expansive 4 BHK signature villa with double-height ceilings, private courtyards, and traditional accents merged with modern technology.',
    price: '$1,850,000',
    location: 'Hillside Meadows, Sector 10',
    area: '4,200 sq ft',
    bedrooms: 4,
    bathrooms: 4,
    amenities: ['Private Garden', 'Double Car Garage', 'Double-Height Living Room', 'Private Courtyard', 'Terrace Barbeque Hub'],
    has3DModel: true,
    modelUrl: '/models/royal-villa.ply',
    rooms: [
      {
        id: 'living',
        name: 'Great Living Room',
        dimensions: '28ft x 20ft',
        areaSqFt: 560,
        x: 0, y: 0, w: 55, h: 60,
        hotspots: [
          {
            id: 'v-hs1',
            label: 'Double-Height Lounge',
            details: 'Magnificent central lounge with soaring 20ft ceilings.',
            x: 50, y: 50,
            specifications: {
              modern: 'Large grey linen corner sofa, monolithic concrete block tables, high-hanging pendant lamps.',
              luxury: 'Plush velvet wrap-around cream sofa, gold chandeliers, polished marble centerpieces.',
              minimalist: 'Low oak sectional sofa, plain natural walls, large windows letting in natural sunlight.',
              scandinavian: 'Cosy grey and beige armchairs, fuzzy knit carpets, light ash cabinets.',
              contemporary: 'Bold asymmetric sectional, futuristic metal lighting, abstract art panels.',
              indian: 'Grand teakwood swing, brass floor lamps, traditional block-printed silk cushions.'
            }
          }
        ],
        furniture: {
          modern: [
            { id: 'v-f1', name: 'Modern L-Shaped Sectional', type: 'sofa', x: 20, y: 35, w: 55, h: 30 },
            { id: 'v-f2', name: 'Stone Slab Center Table', type: 'table', x: 35, y: 20, w: 25, h: 10 }
          ],
          luxury: [
            { id: 'v-f1', name: 'Royal Velvet Sectional Sofa', type: 'sofa', x: 20, y: 35, w: 55, h: 30 },
            { id: 'v-f2', name: 'Polished Marble Center Table', type: 'table', x: 35, y: 20, w: 25, h: 10 }
          ],
          minimalist: [
            { id: 'v-f1', name: 'Low White Modular Seating', type: 'sofa', x: 25, y: 40, w: 45, h: 20 },
            { id: 'v-f2', name: 'Birch Block Coffee Table', type: 'table', x: 38, y: 25, w: 20, h: 8 }
          ],
          scandinavian: [
            { id: 'v-f1', name: 'Soft Grey Wool Corner Sofa', type: 'sofa', x: 20, y: 35, w: 55, h: 30 },
            { id: 'v-f2', name: 'Light Birch Coffee Table', type: 'table', x: 35, y: 20, w: 25, h: 10 }
          ],
          contemporary: [
            { id: 'v-f1', name: 'Asymmetric Curved Sofa', type: 'sofa', x: 20, y: 35, w: 55, h: 30 },
            { id: 'v-f2', name: 'Futuristic Chrome Coffee Table', type: 'table', x: 35, y: 20, w: 25, h: 10 }
          ],
          indian: [
            { id: 'v-f1', name: 'Ornate Teakwood Sofa Set & Swing', type: 'sofa', x: 20, y: 35, w: 55, h: 30 },
            { id: 'v-f2', name: 'Polished Rosewood Coffee Table', type: 'table', x: 35, y: 20, w: 25, h: 10 }
          ]
        }
      },
      {
        id: 'bedroom',
        name: 'Grand Master Suite',
        dimensions: '22ft x 18ft',
        areaSqFt: 396,
        x: 0, y: 60, w: 55, h: 40,
        hotspots: [
          {
            id: 'vb-hs1',
            label: 'Royal Canopy Bed',
            details: 'Signature king canopy bed positioned in the center with a dedicated dressing lounge.',
            x: 40, y: 40,
            specifications: {
              modern: 'Black steel frame bed, modern linen bolster pillows, grey accent wall.',
              luxury: 'Gold-plated canopy bed post frame, silk drapery, crystal bedside lamps.',
              minimalist: 'Low solid wood frame bed, plain white wall, concealed soft ambient cove lights.',
              scandinavian: 'Light white ash wood frame bed, wool throw, warm natural blankets.',
              contemporary: 'Curved platform bed design, neon backlighting, grey leather panels.',
              indian: 'Handcrafted four-poster brass and rosewood bed with fine carving work, block-print bedding.'
            }
          }
        ],
        furniture: {
          modern: [
            { id: 'vb-f1', name: 'Upholstered King Canopy Bed', type: 'bed', x: 20, y: 30, w: 35, h: 40 },
            { id: 'vb-f2', name: 'Sleek Dark Dressing Unit', type: 'table', x: 65, y: 20, w: 25, h: 20 }
          ],
          luxury: [
            { id: 'vb-f1', name: 'Gold Gilded Canopy King Bed', type: 'bed', x: 20, y: 30, w: 35, h: 40 },
            { id: 'vb-f2', name: 'Marble Dressing Console & Mirror', type: 'table', x: 65, y: 20, w: 25, h: 20 }
          ],
          minimalist: [
            { id: 'vb-f1', name: 'Low Oak Platform Bed', type: 'bed', x: 20, y: 30, w: 35, h: 40 },
            { id: 'vb-f2', name: 'Floating Birch vanity ledge', type: 'table', x: 65, y: 20, w: 25, h: 10 }
          ],
          scandinavian: [
            { id: 'vb-f1', name: 'White Ash Platform Canopy Bed', type: 'bed', x: 20, y: 30, w: 35, h: 40 },
            { id: 'vb-f2', name: 'Wood Study Desk & Armchair', type: 'table', x: 65, y: 20, w: 25, h: 20 }
          ],
          contemporary: [
            { id: 'vb-f1', name: 'Curved Floating Platform Bed', type: 'bed', x: 20, y: 30, w: 35, h: 40 },
            { id: 'vb-f2', name: 'Sleek Floating Console Desk', type: 'table', x: 65, y: 20, w: 25, h: 20 }
          ],
          indian: [
            { id: 'vb-f1', name: 'Carved Teakwood Four-Poster Bed', type: 'bed', x: 20, y: 30, w: 35, h: 40 },
            { id: 'vb-f2', name: 'Teak Dressing Drawer Cabinet', type: 'table', x: 65, y: 20, w: 25, h: 20 }
          ]
        }
      },
      {
        id: 'kitchen',
        name: 'Dining & Kitchen Island',
        dimensions: '20ft x 16ft',
        areaSqFt: 320,
        x: 55, y: 0, w: 45, h: 50,
        hotspots: [
          {
            id: 'vk-hs1',
            label: 'Chef Counter',
            details: 'Equipped with professional appliances and custom cabinetry.',
            x: 50, y: 40,
            specifications: {
              modern: 'Quartz counter, slate grey cabinetry, designer metal stools.',
              luxury: 'Exotic onyx stone light-transmitting counter, brass trims, crystal lights.',
              minimalist: 'Plain seamless light stone workspace, push-latch storage units.',
              scandinavian: 'White ash wood drawers, birchwood prep countertops, cute blue ceramics.',
              contemporary: 'Brushed metal cabinets, integrated touch-panel cooking hob.',
              indian: 'Thick black granite counters, copper accessories, hand-painted ceramic tile accents.'
            }
          }
        ],
        furniture: {
          modern: [{ id: 'vk-f1', name: 'Quartz Top Dining Table', type: 'table', x: 25, y: 55, w: 50, h: 30 }],
          luxury: [{ id: 'vk-f1', name: 'Onyx Top Dining Table & Brass Chairs', type: 'table', x: 25, y: 55, w: 50, h: 30 }],
          minimalist: [{ id: 'vk-f1', name: 'Oak dining block and benches', type: 'table', x: 25, y: 55, w: 50, h: 25 }],
          scandinavian: [{ id: 'vk-f1', name: 'White Wood Table & Wishbone Chairs', type: 'table', x: 25, y: 55, w: 50, h: 30 }],
          contemporary: [{ id: 'vk-f1', name: 'Tempered Glass Table & Steel Chairs', type: 'table', x: 25, y: 55, w: 50, h: 30 }],
          indian: [{ id: 'vk-f1', name: 'Rosewood Dining Table Set', type: 'table', x: 25, y: 55, w: 50, h: 30 }]
        }
      },
      {
        id: 'courtyard',
        name: 'Internal Courtyard',
        dimensions: '16ft x 16ft',
        areaSqFt: 256,
        x: 55, y: 50, w: 45, h: 50,
        hotspots: [
          {
            id: 'vc-hs1',
            label: 'Fountain Sanctuary',
            details: 'A peaceful open-to-sky inner courtyard containing fresh green plants.',
            x: 50, y: 50,
            specifications: {
              modern: 'Minimalist bubbling basalt block water column, grey gravel bed, bamboo borders.',
              luxury: 'White marble tiered fountain, climbing ivy walls, gold accent lights.',
              minimalist: 'Still square mirror pool, single maple tree, sand garden.',
              scandinavian: 'Simple rock bowl water feature, pine planters, soft yellow lights.',
              contemporary: 'Glass water wall panel, chrome planters, geometric stone layout.',
              indian: 'Ornate hand-carved stone multi-tiered fountain, marigolds, brass oil lamps (diya) stands.'
            }
          }
        ],
        furniture: {
          modern: [{ id: 'vc-f1', name: '2 Lounge Chairs & Water Fountain', type: 'table', x: 30, y: 30, w: 40, h: 40 }],
          luxury: [{ id: 'vc-f1', name: 'Wrought-Iron Sofa & Marble Fountain', type: 'sofa', x: 25, y: 25, w: 50, h: 50 }],
          minimalist: [{ id: 'vc-f1', name: 'Stone block seating & Zen Water Basin', type: 'table', x: 35, y: 35, w: 30, h: 30 }],
          scandinavian: [{ id: 'vc-f1', name: 'Rattan chairs & Rock Water Bowl', type: 'table', x: 30, y: 30, w: 40, h: 40 }],
          contemporary: [{ id: 'vc-f1', name: 'Sleek steel chairs & Glass Water Wall', type: 'table', x: 30, y: 30, w: 40, h: 40 }],
          indian: [{ id: 'vc-f1', name: 'Teakwood Swings & Carved Stone Fountain', type: 'sofa', x: 20, y: 20, w: 60, h: 60 }]
        }
      }
    ]
  },
  {
    id: 'unfinished-condo',
    name: 'Unfinished Condo Layout',
    type: 'apartment',
    description: 'A planned condominium project with draft floor plans. 3D model generation is pending.',
    price: '$420,000',
    location: 'Downtown Core, Sector 7',
    area: '950 sq ft',
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Central Heating', 'Fitness Center', 'Shared Lounge'],
    has3DModel: false,
    rooms: []
  }
];
