import type { Document } from 'bson';
import type { Collection } from 'mongodb';

import type { PaginationMetadata } from '$libs/db/schemas/pagination';

function getPaginationMetadata(
  currentPage: number,
  itemTotal: number,
  limit: number,
): PaginationMetadata {
  return {
    page: currentPage,
    limit,
    total: Math.max(Math.ceil(itemTotal / limit), 1),
    count: itemTotal,
  };
}

export async function paginate<T extends Document, R = T>(
  model: Collection<T>,
  pipeline: Document[],
  filter: { page: number; limit: number },
) {
  const cursor = model.aggregate<{ data: R[]; metadata: { total: number } }>([
    ...pipeline,
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [
          { $skip: (filter.page - 1) * filter.limit },
          { $limit: filter.limit },
        ],
      },
    },
    { $unwind: '$metadata' },
  ]);

  const result = await cursor.next();
  const pagination = getPaginationMetadata(
    filter.page,
    result?.metadata.total ?? 0,
    filter.limit,
  );

  return { data: result?.data ?? [], pagination };
}
