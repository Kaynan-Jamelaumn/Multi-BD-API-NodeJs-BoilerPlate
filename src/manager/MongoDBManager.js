import { DBManager } from "./DBManager.js";

export class MongoDBManager extends DBManager {
  async create(data) {
    return this.model.create(data);
  }

  buildSort(sortBy, order) {
    return { [sortBy]: order === 'DESC' ? -1 : 1 };
  }

  async find(query, { exclude = [], sort, skip, limit } = {}) {
    return this.model.find(query)
      .select(exclude.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}))
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findOne(query, { exclude = [] } = {}) {
    return this.model.findOne(query)
      .select(exclude.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}));
  }

  async findById(id, { exclude = [] } = {}) {
    return this.model.findById(id)
      .select(exclude.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}));
  }

  async findAndCount(query, options = {}) {
    const [data, count] = await Promise.all([
      this.find(query, options),
      this.model.countDocuments(query)
    ]);
    return { count, rows: data };
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async softDelete(id) {
    return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async reactivate(id) {
    return this.model.findByIdAndUpdate(id, { isActive: true }, { new: true });
  }

  buildSearchQuery(searchTerm, fields) {
    return {
      $or: fields.map(field => ({
        [field]: { $regex: searchTerm, $options: "i" }
      }))
    };
  }
}