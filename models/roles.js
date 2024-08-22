class Roles {

  constructor() {
    this.roles = {};
  }

  addRole(user, role) {
    if (this.roles[user]) {
      this.roles[user].push(role);
    } else this.roles[user] = [role];
    return { user: user, role: this.roles[user] };
  }

  addRoles(user, roles) {
    if (this.roles[user]) {
      this.roles[user] = [...this.roles[user], ...roles];
    } else this.roles[user] = roles;
    return { user: user, role: this.roles[user] };
  }

  getRoles(user) {
    return this.roles[user];
  }

  deleteRole(user, role) {
    if (this.roles[user]) {
      this.roles[user] = this.roles[user].filter((r) => r !== role);
    }
    return { user: user, role: this.roles[user] };
  }
}
module.exports = new Roles();