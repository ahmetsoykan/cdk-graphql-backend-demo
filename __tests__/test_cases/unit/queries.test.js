const helpers = require("../helpers/client");

test("Query -> getNotes test", async () => {
  const res = await helpers.query(
    `query MyQuery {
        getNotes {
          items {
            detail
            id
          }
          nextToken
        }
      }
    `
  );

  expect(res.data).toBeDefined();
});
