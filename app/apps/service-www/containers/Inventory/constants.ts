const createSymbol = (name: string) => `containers/inventory/${name}`;

/**
 * STATUS
 */
export const INIT = createSymbol('INIT');

export const LIMIT_PAGE = 20;

export enum PartType {
  BODY = 1,
  WEAPON = 2,
  GADGET = 3,
  WHEEL = 4,
  STAR_DOG = 5,
  ROBOT = 6,
}

export const TABS = [
  {
    label: 'Body',
    value: PartType.BODY,
  },
  {
    label: 'Weapon',
    value: PartType.WEAPON,
  },
  {
    label: 'Gadget',
    value: PartType.GADGET,
  },
  {
    label: 'Wheel',
    value: PartType.WHEEL,
  },
  {
    label: 'Robots',
    value: PartType.ROBOT,
  },
];

export const SortByOptions = [
  'All',
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Mythical',
  'Legendary',
];

export const ViewOptions = ['grid', 'list'];
