import { Item } from '../types';
import { supabase } from './supabase';

const STORAGE_KEY = 'ZoeLuCollection';

// Fetch items from Supabase for a specific user
export const fetchItemsFromCloud = async (userId: string): Promise<Item[]> => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw error;

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      photo: row.photo,
      type: row.type as any,
      shape: row.shape as any,
      color: row.color,
      price: Number(row.price),
      purchasePrice: row.purchase_price ? Number(row.purchase_price) : undefined,
      usageCount: row.usage_count,
      isSold: row.is_sold,
      sellingPrice: row.selling_price ? Number(row.selling_price) : undefined,
      notes: row.notes || undefined
    }));
  } catch (error) {
    console.error("Error fetching items from Supabase:", error);
    return [];
  }
};

// Save or Update an item in Supabase
export const saveItemToCloud = async (userId: string, item: Item): Promise<void> => {
  try {
    const { error } = await supabase
      .from('items')
      .upsert({
        id: item.id,
        user_id: userId,
        name: item.name,
        photo: item.photo,
        type: item.type,
        shape: item.shape,
        color: item.color,
        price: item.price,
        purchase_price: item.purchasePrice || null,
        usage_count: item.usageCount,
        is_sold: item.isSold,
        selling_price: item.sellingPrice || null,
        notes: item.notes || null
      });

    if (error) throw error;
  } catch (error) {
    console.error("Error saving item to Supabase:", error);
  }
};

// Batch save items to Supabase
export const saveItemsToCloud = async (userId: string, items: Item[]): Promise<void> => {
  try {
    const itemsToUpsert = items.map(item => ({
      id: item.id,
      user_id: userId,
      name: item.name,
      photo: item.photo,
      type: item.type,
      shape: item.shape,
      color: item.color,
      price: item.price,
      purchase_price: item.purchasePrice || null,
      usage_count: item.usageCount,
      is_sold: item.isSold,
      selling_price: item.sellingPrice || null,
      notes: item.notes || null
    }));

    const { error } = await supabase
      .from('items')
      .insert(itemsToUpsert);

    if (error) throw error;
  } catch (error) {
    console.error("Error batch saving items to Supabase:", error);
    throw error;
  }
};

// Delete an item from Supabase
export const deleteItemFromCloud = async (userId: string, itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting item from Supabase:", error);
  }
};

// Delete all items for a user from Supabase
export const deleteAllItemsFromCloud = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting all items from Supabase:", error);
    throw error;
  }
};

// Upload an image to Supabase Storage
export const uploadImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `item-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('collection-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('collection-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// Legacy local storage functions (used for migration)
export const getLocalItems = (): Item[] => {
  try {
    const itemsJson = localStorage.getItem(STORAGE_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error("Could not retrieve items from localStorage", error);
    return [];
  }
};

export const clearLocalItems = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};