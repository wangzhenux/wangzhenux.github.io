export interface CATEGORY {
  id: string;
  label: string;
}

export const CATEGORIES: CATEGORY[] = [
  {
    id: "ux",
    label: "UX"
  },
  {
    id: "design",
    label: "Design"
  },
  {
    id: "develop",
    label: "Develop"
  }
];

const defaultCategory: CATEGORY = {
  id: "ux",
  label: "UX"
};

export class Category {
  static getCategories(ids: string[]) {
    const categories: CATEGORY[] = [];
    ids.map(id =>
      categories.push(CATEGORIES.find(c => c.id === id) || defaultCategory)
    );
    return categories;
  }
}
