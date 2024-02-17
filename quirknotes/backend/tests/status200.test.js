test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
  });

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  const dlt = await fetch(`${SERVER_URL}/deleteNote/${postNoteBody.insertedId}`, {
    method: "DELETE",
  });
  expect(dlt.status).toBe(200);
});


test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const getNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getNotesRes.json();
  expect(getNotesRes.status).toBe(200);
  expect(getAllNotesBody.response).toEqual([]);
});

async function createNote(title, content) {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();
  return { response: postNoteBody, status: postNoteRes.status };
}

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  const title = "GetTwoTest";
  const content = "GetTwoContent";

  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);

  const { response: Body2, status: Status2 } = await createNote(title, content);
  expect(Status2).toBe(200);

  const getNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getNotesRes.json();
  expect(getNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(2);

  const dlt1 = await fetch(`${SERVER_URL}/deleteNote/${Body1.insertedId}`, {
    method: "DELETE",
  });
  expect(dlt1.status).toBe(200);

  const dlt2 = await fetch(`${SERVER_URL}/deleteNote/${Body2.insertedId}`, {
    method: "DELETE",
  });
  expect(dlt2.status).toBe(200);
});

 
test("/deleteNote - Delete a note", async () => {
  const title = "DeleteTest";
  const content = "DeleteContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);

  const deleteNote = await fetch(`${SERVER_URL}/deleteNote/${Body1.insertedId}`, {
    method: "DELETE",
  });
  expect(deleteNote.status).toBe(200);

  const deleteBody = await deleteNote.json();
  expect(deleteBody.response).toBe(`Document with ID ${Body1.insertedId} deleted.`);
});


test("/patchNote - Patch with content and title", async () => {
  const title = "PatchTest";
  const content = "PatchContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);

  const patchedTitle = "PatchValid";
  const patchedContent = "ContentValid";
  const patchNote = await fetch((`${SERVER_URL}/patchNote/${Body1.insertedId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: patchedTitle, content: patchedContent }),
  });
  expect(patchNote.status).toBe(200);
  const patchBody = await patchNote.json();
  expect(patchBody.response).toBe(`Document with ID ${Body1.insertedId} patched.`);

  const deleteNote = await fetch(`${SERVER_URL}/deleteNote/${Body1.insertedId}`, {
    method: "DELETE",
  });
  expect(deleteNote.status).toBe(200);
});


test("/patchNote - Patch with just title", async () => {
  const title = "PatchTest";
  const content = "PatchContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);

  const patchedTitle = "PatchValid";
  const patchNote = await fetch((`${SERVER_URL}/patchNote/${Body1.insertedId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: patchedTitle}),
  });
  expect(patchNote.status).toBe(200);
  const patchBody = await patchNote.json();
  expect(patchBody.response).toBe(`Document with ID ${Body1.insertedId} patched.`);

  const deleteNote = await fetch(`${SERVER_URL}/deleteNote/${Body1.insertedId}`, {
    method: "DELETE",
  });
  expect(deleteNote.status).toBe(200);
});

test("/patchNote - Patch with just content", async () => {
  const title = "PatchTest";
  const content = "PatchContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);

  const patchedContent = "ContentValid";
  const patchNote = await fetch((`${SERVER_URL}/patchNote/${Body1.insertedId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: patchedContent }),
  });
  expect(patchNote.status).toBe(200);
  const patchBody = await patchNote.json();
  expect(patchBody.response).toBe(`Document with ID ${Body1.insertedId} patched.`);

  const deleteNote = await fetch(`${SERVER_URL}/deleteNote/${Body1.insertedId}`, {
    method: "DELETE",
  });
  expect(deleteNote.status).toBe(200);
});


test("/deleteAllNotes - Delete one note", async () => {
  const title = "DeleteOneTest";
  const content = "DeleteOneContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);

  const deleteAllNotes = await fetch(`${SERVER_URL}/deleteAllNotes/`, {
    method: "DELETE",
  });
  expect(deleteAllNotes.status).toBe(200);

  const deleteBody = await deleteAllNotes.json();
  expect(deleteBody.response).toBe(`1 note(s) deleted.`);
});


test("/deleteAllNotes - Delete three notes", async () => {
  const title = "DeleteAllTest";
  const content = "DeleteAllContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);
  const { response: Body2, status: Status2 } = await createNote(title, content);
  expect(Status2).toBe(200);
  const { response: Body3, status: Status3 } = await createNote(title, content);
  expect(Status3).toBe(200);

  const deleteAllNotes = await fetch(`${SERVER_URL}/deleteAllNotes/`, {
    method: "DELETE",
  });
  expect(deleteAllNotes.status).toBe(200);

  const deleteBody = await deleteAllNotes.json();
  expect(deleteBody.response).toBe(`3 note(s) deleted.`);
});


test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const title = "UpdateColorTest";
  const content = "UpdateColorContent";
  const { response: Body1, status: Status1 } = await createNote(title, content);
  expect(Status1).toBe(200);
  
  const color = "idk, blue?";
  const updateColor = await fetch((`${SERVER_URL}/updateNoteColor/${Body1.insertedId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color }),
  });
  expect(updateColor.status).toBe(200);
  const colorBody = await updateColor.json();
  expect(colorBody.message).toBe(`Note color updated successfully.`);


  const deleteNote = await fetch(`${SERVER_URL}/deleteNote/${Body1.insertedId}`, {
    method: "DELETE",
  });
  expect(deleteNote.status).toBe(200);
});