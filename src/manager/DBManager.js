export class DBManager {
    constructor(model) {
      if (this.constructor === DBManager) {
        throw new Error("DBManager is an abstract class and cannot be instantiated");
      }
      this.model = model;
    }
  
    async create(data) { throw new Error("Not implemented"); }
    async find(query, options) { throw new Error("Not implemented"); }
    async findOne(query, options) { throw new Error("Not implemented"); }
    async findById(id, options) { throw new Error("Not implemented"); }
    async findAndCount(query, options) { throw new Error("Not implemented"); }
    async update(id, data) { throw new Error("Not implemented"); }
    async delete(id) { throw new Error("Not implemented"); }
    async softDelete(id) { throw new Error("Not implemented"); }
    async reactivate(id) { throw new Error("Not implemented"); }
    buildSearchQuery(searchTerm, fields) { throw new Error("Not implemented"); }
    buildSort(sortBy, order) {throw new Error("Not implemented");}
  }