
import rolesConfig from '../config/roles.json';

export interface RoleType {
    name: string;
    permissions: string[];
}



class Role {
    private roles: RoleType[];

    constructor() {
        this.roles = rolesConfig.roles as RoleType[];
    }

    getRoleByName(name: string): RoleType | undefined {
        return this.roles.find((role) => role.name === name);
    }

    getRoles(): RoleType[] {
        return this.roles;
    }
}

export default Role;
