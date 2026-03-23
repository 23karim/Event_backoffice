
export const Role = {
  ADMIN: "admin",
  CLIENT: "client",
};
export class User {
  constructor({ id, nom, prenom, email, tel, role, image, token }) {
    this.id = id || null;
    this.nom = nom || "";
    this.prenom = prenom || "";
    this.email = email || "";
    this.tel = tel || "";
    this.role = role || Role.CLIENT;
    this.image = image || ""; 
    this.token = token || ""; 
  }
  isAdmin() {
    return this.role === Role.ADMIN;
  }
  getFullName() {
    return `${this.nom} ${this.prenom}`.trim();
  }
}