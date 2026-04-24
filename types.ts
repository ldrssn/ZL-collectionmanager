// FIX: Removed circular import that was causing declaration conflicts. A file should not import from itself.

export enum ItemType {
  Klappe = 'Klappe',
  Henkel = 'Henkel',
  Körper = 'Körper',
  Accessoire = 'Accessoire',
  Kombination = 'Kombination',
}

export enum ItemShape {
  Square = 'Square',
  Rund = 'Rund',
  Mini = 'Mini',
}

export interface Item {
  id: string;
  name: string;
  photo: string;
  type: ItemType;
  shape: ItemShape;
  color: string[];
  price: number;
  purchasePrice?: number;
  usageCount: number;
  isSold: boolean;
  sellingPrice?: number;
  notes?: string;
  gallery?: string[];
}

export interface Filters {
  type: ItemType[];
  shape: ItemShape[];
  color: string[];
  soldStatus: 'all' | 'sold' | 'in_collection';
}

export enum SortBy {
  Name = 'name',
  PriceAsc = 'price_asc',
  PriceDesc = 'price_desc',
  Usage = 'usage',
}