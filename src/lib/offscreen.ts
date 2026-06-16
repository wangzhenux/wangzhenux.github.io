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
  { key: 'ink', label: 'Ink' },
  { key: 'creatures', label: 'Creatures' },
  { key: 'places', label: 'Places' },
];

/**
 * The collection. Order interleaves the panoramic (`wide`) and scroll (`tall`)
 * pieces among the photographs so the quilt packs evenly at every column count;
 * the category filter regroups them anyway. All descriptions are literal — no
 * locations or facts are asserted beyond what the image shows.
 */
export const gallery: GalleryItem[] = [
  { file: 'caligraphy.jpeg', w: 3416, h: 1113, cat: 'ink', wide: true,
    alt: 'Chinese calligraphy reading 海纳百川 (“the sea holds a hundred rivers”)' },
  { file: 'bear.jpg', w: 3412, h: 1920, cat: 'creatures',
    alt: 'A black bear crossing a road beside a parked car' },
  { file: 'blue_jay.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A blue jay perched on a bare branch' },
  { file: 'bainian.jpg', w: 2048, h: 3641, cat: 'ink', tall: true,
    alt: 'Chinese calligraphy reading 百年好合 (“a hundred years of harmonious union”)' },
  { file: 'squirrel.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A fox squirrel on a tree branch, facing the camera' },
  { file: 'duck.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A mallard drake standing on rocks at the water’s edge' },
  { file: 'eagle.jpeg', w: 1246, h: 465, cat: 'ink', wide: true,
    alt: 'Chinese ink painting of an eagle in flight, inscribed 鹏程万里' },
  { file: 'lizard.jpg', w: 772, h: 568, cat: 'creatures',
    alt: 'A green anole lizard resting on a leaf' },
  { file: 'shrimp.jpg', w: 4032, h: 2268, cat: 'ink',
    alt: 'Ink painting of two shrimp among reeds' },
  { file: 'libai.jpg', w: 2268, h: 4032, cat: 'ink', tall: true,
    alt: 'Chinese calligraphy of Li Bai’s lines 人生得意须尽欢，莫使金樽空对月 in running script' },
  { file: 'sea_gull.jpg', w: 815, h: 815, cat: 'creatures',
    alt: 'A gull in flight past glass high-rises' },
  { file: 'IMG_2261.jpg', w: 2048, h: 1252, cat: 'creatures',
    alt: 'A honeybee on pale wildflowers' },
  { file: 'IMG_4939.jpg', w: 2048, h: 988, cat: 'places', wide: true,
    alt: 'A boat on a calm lake dotted with islands' },
  { file: 'branch.jpg', w: 4032, h: 2268, cat: 'ink',
    alt: 'Ink painting of a leafy branch' },
  { file: 'IMG_3572.jpg', w: 2048, h: 1365, cat: 'places',
    alt: 'Sunset over the water, seen from a hillside terrace' },
  { file: 'IMG_4044.jpg', w: 2048, h: 1365, cat: 'places',
    alt: 'A marina at blue hour, boats reflected on still water' },
];
