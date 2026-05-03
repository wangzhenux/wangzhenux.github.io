import { CATEGORY, Category } from "./category";

export interface WORK {
  id: string;
  category: CATEGORY[];
  label: string;
  description: React.ReactNode;
  url: string;
  order: number;
  bg: string;
  img: string;
  visible: boolean;
  locked: boolean;
}

const IMG_FOLDER = "previews/new";
const LIGHT_BG = "none";
const DARK_BG = "none";

export const WORKS: WORK[] = [
  {
    id: "tripalink",
    category: Category.getCategories(["design", "ux"]),
    label: "Tripalink Corp.",
    description: "Lead Product Designer",
    url: "/tripalink",
    order: 1,
    img: `${IMG_FOLDER}/tripalink-dark.png`,
    visible: true,
    locked: true,
  },
  {
    id: "twilio",
    category: Category.getCategories(["design", "ux", "develop"]),
    label: "Twilio Inc.",
    description: "Product Designer",
    url: "/twilio",
    order: 2,
    img: `${IMG_FOLDER}/Twilio-logo-red.png`,
    visible: true,
    locked: false,
  },
  {
    id: "tasktop",
    category: Category.getCategories(["design", "ux", "develop"]),
    label: "Tasktop Technologies Inc.",
    description: "Senior UX Designer",
    url: "/tasktop",
    order: 3,
    img: `${IMG_FOLDER}/tasktop.png`,
    visible: true,
    locked: false,
  },
  {
    id: "techscene",
    category: Category.getCategories(["design", "ux"]),
    label: "Techscene Website",
    description: "UX Designer",
    url: "/techscene",
    order: 6,
    img: `${IMG_FOLDER}/techscene.png`,
    visible: true,
    locked: false,
  },
  {
    id: "rackspace",
    category: Category.getCategories(["design", "ux"]),
    label: "Rackspace Inc.",
    description: "UX Designer",
    url: "/rackspace",
    order: 4,
    img: `${IMG_FOLDER}/rackspace.png`,
    visible: true,
    locked: false,
  },
  {
    id: "team",
    category: Category.getCategories(["design", "ux"]),
    label: "T.E.A.M Mobile App",
    description: "UX Designer",
    url: "/team",
    order: 7,
    img: `${IMG_FOLDER}/team.png`,
    visible: true,
    locked: false,
  },
  {
    id: "design",
    category: Category.getCategories(["design"]),
    label: "Design Misc.",
    description: "Designer, Photographer, Blogger",
    url: "/design-misc",
    order: 5,
    img: `${IMG_FOLDER}/design.png`,
    visible: true,
    locked: false,
  },
  {
    id: "park",
    category: Category.getCategories(["ux"]),
    label: "Park Engagement",
    description: "UX Researcher",
    url: "/park-engagement",
    order: 8,
    img: `${IMG_FOLDER}/park-engagement.png`,
    visible: true,
    locked: false,
  },
  {
    id: "plotGuru",
    category: Category.getCategories(["ux"]),
    label: "Plot Guru",
    description: "UX Researcher",
    url: "/plotGuru",
    order: 9,
    img: `${IMG_FOLDER}/plotguru.png`,
    visible: true,
    locked: false,
  },
  {
    id: "ilab",
    category: Category.getCategories(["develop"]),
    label: "iLab Team Site",
    description: "Web Developer",
    url: "/ilab",
    order: 10,
    img: `${IMG_FOLDER}/ilab.png`,
    visible: false,
    locked: false,
  },
  {
    id: "citportal",
    category: Category.getCategories(["develop"]),
    label: "Citportal",
    description: "Web Design & Development",
    url: "/citportal",
    order: 11,
    img: `${IMG_FOLDER}/citportal.png`,
    visible: false,
    locked: false,
  },
]
  .sort((a, b) => a.order - b.order)
  .map((w) =>
    w.order % 2 > 0
      ? {
          ...w,
          bg: DARK_BG,
        }
      : {
          ...w,
          bg: LIGHT_BG,
        }
  );
