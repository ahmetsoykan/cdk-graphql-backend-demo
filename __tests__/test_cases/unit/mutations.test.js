const helpers = require("../helpers/client");
let ID;

test("Mutation -> createNote test", async () => {
  const res = await helpers.mutate(
    `mutation MyMutation {
    createNote(note: {detail: "test"}) {
      detail
      id
    }
  }
  `
  );

  ID = res.data.createNote.id;
  expect(res.data.createNote.detail).toBe("test");
});

test("Mutation -> deleteNote test", async () => {
  const res = await helpers.mutate(
    `mutation MyMutation {
      deleteNote(id: "${ID}") {
        id
      }
    }
    `
  );
  expect(res.data.deleteNote.id).toBe(`${ID}`);
});
