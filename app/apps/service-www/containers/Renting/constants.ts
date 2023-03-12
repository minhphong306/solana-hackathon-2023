
export const LIMIT_PAGE = 20;

export enum PartType {
  BODY = 1,
  WEAPON = 2,
  GADGET = 3,
  WHEEL = 4,
  STAR_DOG = 5,
  ROBOT = 6,
}

export enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
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

export const SortByStatus = [
  'All status',
  'Renting',
  'Listing',
];

export const SortByPrice = [
  'Lastest',
  'Price low to high',
  'Price high to low',
];
