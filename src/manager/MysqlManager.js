import { DBManager } from "./DBManager.js";

export class MySQLManager extends DBManager {
  constructor(model) {
    super(model);
  }

  async create(data) {
    return this.model.create({ ...data }, { returning: true, plain: true });
  }

  async find(query, { exclude = [], sort, offset, limit } = {}) {
    return this.model.findAll({
      where: query,
      attributes: { exclude },
      order: sort,
      offset,
      limit,
    });
  }

  async findOne(query, { exclude = [] } = {}) {
    return this.model.findOne({
      where: query,
      attributes: { exclude },
    });
  }

  async findById(id, { exclude = [] } = {}) {
    return this.model.findByPk(id, { attributes: { exclude } });
  }

  async findAndCount(query, options = {}) {
    return this.model.findAndCountAll({
      where: query,
      ...options,
    });
  }

  async update(id, data) {
    const user = await this.model.findByPk(id);
    if (!user) return null;
    return user.update(data);
  }

  async softDelete(id) {
    return this.update(id, { isActive: false });
  }

  async reactivate(id) {
    return this.update(id, { isActive: true });
  }

  buildSearchQuery(searchTerm, fields) {
    return {
      [this.Op.or]: fields.map((field) => ({
        [field]: { [this.Op.like]: `%${searchTerm}%` },
      })),
    };
  }

  buildSort(sortBy, order) {
    return [[sortBy, order.toUpperCase()]];
  }


  get Op() {
    return this.model.sequelize.Sequelize.Op;
  }
}
