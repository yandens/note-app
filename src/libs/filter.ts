import type { Document } from 'bson';
import { endOfDay, startOfDay } from 'date-fns';
import { type Filter } from 'mongodb';

export function text<T>(
  query: Filter<T>,
  field: keyof T,
  value: string | undefined,
  insensitive = true,
) {
  if (value === undefined || value === '') return;
  query[field as keyof Filter<T>] = new RegExp(
    value,
    insensitive ? 'i' : undefined,
  );
}

export function dateBetween<T>(
  query: Filter<T>,
  field: keyof T,
  valueFrom: string | undefined,
  valueUntil: string | undefined,
) {
  const _field = field as keyof Filter<T>;
  if (valueFrom) {
    query[_field] = {
      $gte: startOfDay(new Date(valueFrom)),
    };
  }
  if (valueUntil) {
    query[_field] = {
      ...query[_field],
      $lte: endOfDay(new Date(valueUntil)),
    };
  }
}

export function sort<T>(
  pipeline: Document[],
  filter?: { sortBy?: keyof T | undefined; sortDirection?: 'asc' | 'desc' },
) {
  if (filter?.sortBy) {
    const dir = filter.sortDirection === 'asc' ? 1 : -1;
    pipeline.push({
      $sort: {
        [filter.sortBy]: dir,
      },
    });
  }
}
