/**
 * Data for the Off-screen gallery (/off-screen) — photographs, calligraphy, and
 * ink painting. Kept separate from layout so the image source can be swapped in
 * ONE place when these move to a CDN.
 *
 * IMAGE HOSTING (migration note):
 *   `imgUrl(file)` builds the src. Today it points at the in-repo `public/`
 *   copies. To move to Cloudinary (or any CDN) later, change ONLY `imgUrl` to
 *   return the remote URL (e.g. `https://res.cloudinary.com/<cloud>/image/upload/
 *   f_auto,q_auto,w_1600/off-screen/${file}`) and delete the local copies. Each
 *   item already carries intrinsic `w`/`h` so layout stays CLS-free regardless
 *   of host.
 */

/** Build the image URL for a gallery file. Single seam for a future CDN swap. */
export function imgUrl(file: string): string {
  return `/cases/sketches/${file}`;
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
}

/** Filter chips, in display order. `all` shows everything. */
export const filters: { key: 'all' | GalleryCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ink', label: 'Ink' },
  { key: 'creatures', label: 'Creatures' },
  { key: 'places', label: 'Places' },
];

/**
 * The collection. Order sets the quilt rhythm: the two brushwork pieces lead,
 * then the creatures, then the places, with the three panoramic pieces
 * (calligraphy, eagle, islands) flagged `wide`. All descriptions are literal —
 * no locations or facts are asserted beyond what the image shows.
 */
export const gallery: GalleryItem[] = [
  { file: 'caligraphy.jpeg', w: 3416, h: 1113, cat: 'ink', wide: true,
    alt: 'Chinese calligraphy reading 海纳百川 (“the sea holds a hundred rivers”)' },
  { file: 'eagle.jpeg', w: 1246, h: 465, cat: 'ink', wide: true,
    alt: 'Chinese ink painting of an eagle in flight, inscribed 鹏程万里' },
  { file: 'bear.jpg', w: 3412, h: 1920, cat: 'creatures',
    alt: 'A black bear crossing a road beside a parked car' },
  { file: 'blue_jay.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A blue jay perched on a bare branch' },
  { file: 'squirrel.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A fox squirrel on a tree branch, facing the camera' },
  { file: 'duck.jpg', w: 1920, h: 1280, cat: 'creatures',
    alt: 'A mallard drake standing on rocks at the water’s edge' },
  { file: 'lizard.jpg', w: 772, h: 568, cat: 'creatures',
    alt: 'A green anole lizard resting on a leaf' },
  { file: 'sea_gull.jpg', w: 815, h: 815, cat: 'creatures',
    alt: 'A gull in flight past glass high-rises' },
  { file: 'IMG_2261.jpg', w: 2048, h: 1252, cat: 'creatures',
    alt: 'A honeybee on pale wildflowers' },
  { file: 'IMG_3572.jpg', w: 2048, h: 1365, cat: 'places',
    alt: 'Sunset over the water, seen from a hillside terrace' },
  { file: 'IMG_4044.jpg', w: 2048, h: 1365, cat: 'places',
    alt: 'A marina at blue hour, boats reflected on still water' },
  { file: 'IMG_4939.jpg', w: 2048, h: 988, cat: 'places', wide: true,
    alt: 'A boat on a calm lake dotted with islands' },
];
