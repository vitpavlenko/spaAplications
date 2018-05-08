const BaseController = require('./base_controller');
const { Role } = require('../models');

const sequelize = require('../db');

class RoleController extends BaseController {
  static async update(request, h) {

    const { permission_ids } = request.payload;

    if (!permission_ids) {
      return super.update(request, h);
    }

    try {
      const { recordId, data } = await this.beforeUpdate(request);
      const record = await this.model.findById(recordId);

      if (!record) {
        return h.notFound(`${this.model.name} not found`);
      }

      await this.sequelize.transaction(async (t) => {

        await record.update(data, { transaction: t });
        await record.setPermissions(permission_ids, { transaction: t });
      });

      await record.reload();

      const response = h.response(record);

      return await this.afterUpdate(request, response)
        .catch((err) => this.onHookError(err));

    } catch (err) {
      this.onError(err, request, h);
    }
  }
}

RoleController.model = Role;
RoleController.controllerName = 'roles';

RoleController.sequelize = sequelize;

RoleController.options = {
  id: 'role_id',
  searchBy: ['name']
};

module.exports = RoleController;
