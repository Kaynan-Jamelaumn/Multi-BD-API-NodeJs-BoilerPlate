// src/types/find-options.d.ts

export interface SequelizeFindOptions {
    exclude?: string[];
    sort?: [string, 'ASC' | 'DESC'][];
    offset?: number;
    limit?: number;
  }
  
export interface MongooseFindOptions {
  exclude?: string[];
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}