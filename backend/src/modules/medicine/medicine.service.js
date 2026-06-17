// src/modules/medicine/medicine.service.js

import pool from "../../config/db.js";

// FDA results cache karo — same medicine bar bar search na ho
const fdaCache = new Map();

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 500;

const normalizeMedicineName = (name = "") =>
  name.trim().toLowerCase().replace(/\s+/g, " ");

const buildCacheKey = (medicines = []) =>
  medicines
    .map((medicine) => normalizeMedicineName(medicine.name))
    .filter(Boolean)
    .sort()
    .join("|");

const cleanupCache = () => {
  if (fdaCache.size <= MAX_CACHE_SIZE) return;

  const now = Date.now();

  for (const [key, value] of fdaCache.entries()) {
    if (now - value.timestamp >= CACHE_TTL) {
      fdaCache.delete(key);
    }
  }

  // Agar still zyada hai, oldest entries remove karo
  if (fdaCache.size > MAX_CACHE_SIZE) {
    const extraCount = fdaCache.size - MAX_CACHE_SIZE;
    const keysToDelete = [...fdaCache.keys()].slice(0, extraCount);

    keysToDelete.forEach((key) => fdaCache.delete(key));
  }
};

export const searchMedicinesService = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const search = query.trim();

  const { rows } = await pool.query(
    `SELECT
       id,
       name,
       composition1,
       composition2,
       pack_size,
       type
     FROM medicines
     WHERE 
       (
         name ILIKE $1 OR
         composition1 ILIKE $1 OR
         composition2 ILIKE $1
       )
       AND is_discontinued = FALSE
     ORDER BY
       CASE WHEN name ILIKE $2 THEN 0 ELSE 1 END,
       name ASC
     LIMIT 10`,
    [`%${search}%`, `${search}%`],
  );

  return rows;
};

export const checkInteractionCached = async (medicines = []) => {
  const key = buildCacheKey(medicines);

  if (!key) return [];

  // Cache hit
  if (fdaCache.has(key)) {
    const cached = fdaCache.get(key);

    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    fdaCache.delete(key);
  }

  // Cache miss — FDA/API call
  const result = await checkDrugInteractions(medicines);

  fdaCache.set(key, {
    data: result,
    timestamp: Date.now(),
  });

  cleanupCache();

  return result;
};
