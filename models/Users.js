import path from "path";
import fs from "fs";


class Users {

  static createUser = (email, data = {}) => {
    const filePath = path.join(__dirname, '../data/users', email + '.json');
    fs.writeFileSync(filePath, JSON.stringify({ email, ...data }, null, 2));
  }

  static getUser = (email) => {
    const filePath = path.join(__dirname, '../data/users', email + '.json');
    if (!fs.existsSync(filePath)) {
      return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

}

export default Users;
