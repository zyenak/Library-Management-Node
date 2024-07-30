import rolesConfig from '../config/roles.json';
import { RoleType } from './role';

class Permissions {
  getPermissionsByRoleName(roleName: string): string[] {
    const role = rolesConfig.roles.find((r: RoleType) => r.name === roleName);
    return role ? role.permissions : [];
  }
}

export default Permissions;
