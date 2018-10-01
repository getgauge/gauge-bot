const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/postgres';

async function getClient() {
  const client = new pg.Client(connectionString);
  await client.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS contributors (
      name varchar,
      email varchar,
      nick_name varchar NOT NULL,
      user_id varchar,
      description text,
      time varchar,
      PRIMARY KEY (nick_name)
    )`);
  return client;
}

module.exports = {
  addUser: async function (user) {
    let client,q;
    try {
      if (await this.hasSignedCLA(user.nickname)) return;
      client = await getClient();
      q = `INSERT INTO contributors
      VALUES ('${user.name}','${user.email}','${user.nickname}','${user.userID}','${user.description}','${user.time}')`;
      await client.query(q);
      await client.end();
    } catch (e) {
      console.log(`Failed to add user ${user.nickname}. Reason : ${e}`);
      await client.end();
    }
  },

  hasSignedCLA: async function (name) {
    let client = await getClient();
    let user = await client.query(`SELECT nick_name FROM contributors WHERE nick_name='${name}'`);
    await client.end();
    return user.rowCount > 0;
  },

  getContributor: async function (name) {
    let client = await getClient();
    let users = await client.query(`SELECT * FROM contributors WHERE nick_name='${name}'`);
    if (users.rowCount < 1) {
      return;
    }
    await client.end();
    return users.rows[0];
  },

  getAllContributors: async function () {
    let client = await getClient();
    let users = await client.query(`SELECT * FROM contributors`);
    await client.end();
    return users.rows;
  }
}
