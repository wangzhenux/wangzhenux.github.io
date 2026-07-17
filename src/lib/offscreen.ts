/**
 * Data for the Off-screen gallery (/off-screen) — photographs, calligraphy, and
 * ink painting. Kept separate from layout so the image source lives in ONE place.
 *
 * IMAGE HOSTING: served from Cloudinary (cloud `dcswo1dgj`, folder `off-screen`)
 * with automatic format + quality and a 1600px cap — the originals are no longer
 * in the repo. `imgUrl(file)` is the single seam; to re-host, change only the
 * constants below. Each item carries intrinsic `w`/`h` so layout stays CLS-free
 * regardless of the delivered (downscaled) size.
 */

// f_auto  = best format per browser (AVIF/WebP), q_auto = automatic quality,
// c_limit,w_1600 = downscale to fit 1600px wide, never upscale.
const CLOUDINARY = 'https://res.cloudinary.com/dcswo1dgj/image/upload';
const TRANSFORM = 'f_auto,q_auto,c_limit,w_1600';

/** Build the Cloudinary delivery URL for a gallery file (off-screen/<id>). */
export function imgUrl(file: string): string {
  const id = file.replace(/\.[^.]+$/, ''); // 'caligraphy.jpeg' -> 'caligraphy'
  return `${CLOUDINARY}/${TRANSFORM}/off-screen/${id}`;
}

export type GalleryCategory = 'ink' | 'creatures' | 'places';

export interface GalleryItem {
  /** Source filename (resolved through `imgUrl`). */
  file: string;
  /** Intrinsic pixel dimensions — reserve layout space (no CLS) + drive spans. */
  w: number;
  h: number;
  /** Describes the image (a11y) and doubles as the lightbox caption. */
  alt: string;
  /** Category bucket for the filter. */
  cat: GalleryCategory;
  /** Render as a wide (2-column) tile — for the panoramic pieces. */
  wide?: boolean;
  /** Render as a tall (2-row) tile — for portrait pieces like hanging scrolls. */
  tall?: boolean;
}

/** Filter chips, in display order. `all` shows everything. */
export const filters: { key: 'all' | GalleryCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'creatures', label: 'Creatures' },
  { key: 'places', label: 'Places' },
  { key: 'ink', label: 'Ink' },
];

/**
 * The collection. Order interleaves the panoramic (`wide`) and scroll (`tall`)
 * pieces among the photographs so the quilt packs evenly at every column count;
 * the category filter regroups them anyway. All descriptions are literal — no
 * locations or facts are asserted beyond what the image shows.
 */
export const gallery: GalleryItem[] = [
  // Photographs first, then the ink section (calligraphy + paintings, all
  // matted on one cream ground) grouped at the bottom — the same contiguous
  // block the "Ink" filter chip shows, just trailing the photos instead of
  // interrupting them.
  { file: 'terraced_valley.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'Terraced paddies stepping down a misty mountain valley toward a village' },
  { file: 'fuji_reeds.jpg', w: 2200, h: 1650, cat: 'places', wide: true,
    alt: 'Mount Fuji rising beyond a lake fringed with tall reeds' },
  { file: 'blue_jay.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A blue jay perched on a bare branch' },
  { file: 'chureito_fuji.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A five-story pagoda with Mount Fuji rising behind it' },
  { file: 'squirrel.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A fox squirrel on a tree branch, facing the camera' },
  { file: 'duck.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A mallard drake standing on rocks at the water’s edge' },
  { file: 'great_wall.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'The Great Wall of China winding along forested mountain ridges' },
  { file: 'cedar_path.jpg', w: 1649, h: 2200, cat: 'places', tall: true,
    alt: 'A stone-lantern path climbing between rows of tall cedars' },
  { file: 'IMG_2261.jpg', w: 2048, h: 1252, cat: 'creatures',
    alt: 'A honeybee on pale wildflowers' },
  { file: 'badlands.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'Wind-eroded desert ridges falling away in raking light' },
  { file: 'lighthouse.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A white lighthouse on a green headland above a churning sea' },
  { file: 'yosemite_river.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A granite valley under low cloud, reflected in a still river' },
  { file: 'lone_pine.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A lone pine silhouetted against a fog-veiled granite dome' },
  { file: 'IMG_4939.jpg', w: 2048, h: 988, cat: 'places', wide: true,
    alt: 'A boat on a calm lake dotted with islands' },
  { file: 'red_rocks.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'Red sandstone buttes under a broad desert sky' },
  { file: 'mountain_road.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A car on a hairpin road cut into a forested mountainside' },
  { file: 'arch_bridge.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A slender steel arch footbridge spanning a green gorge' },
  { file: 'green_valley.jpg', w: 1650, h: 2200, cat: 'places', tall: true,
    alt: 'A stream winding through steep green hills' },
  { file: 'IMG_4044.jpg', w: 2048, h: 1365, cat: 'places',
    alt: 'A marina at blue hour, boats reflected on still water' },
  // — Ink section — the calligraphy + eagle scroll are kept adjacent (both
  // are 王震 pieces with a matching red seal, so they read as a pair).
  { file: 'caligraphy4.jpg', w: 3386, h: 1096, cat: 'ink', wide: true,
    alt: 'Chinese calligraphy reading 海纳百川 (“the sea holds a hundred rivers”)' },
  { file: 'eagle3.jpg', w: 1232, h: 438, cat: 'ink', wide: true,
    alt: 'Chinese ink painting of an eagle swooping toward a fish, with a red seal at left' },
  { file: 'bainian.jpg', w: 2048, h: 3641, cat: 'ink', tall: true,
    alt: 'Chinese calligraphy reading 百年好合 (“a hundred years of harmonious union”)' },
  { file: 'shrimp.jpg', w: 4032, h: 2268, cat: 'ink',
    alt: 'Ink painting of two shrimp among reeds' },
  { file: 'libai.jpg', w: 2268, h: 4032, cat: 'ink', tall: true,
    alt: 'Chinese calligraphy of Li Bai’s lines 人生得意须尽欢，莫使金樽空对月 in running script' },
  { file: 'branch.jpg', w: 4032, h: 2268, cat: 'ink',
    alt: 'Ink painting of a leafy branch' },
];
