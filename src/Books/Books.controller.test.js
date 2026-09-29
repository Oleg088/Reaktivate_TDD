import { BooksController } from "./Books.controller";

function createStubRepository({
  allBooks = [],
  privateBooks = [],
  addBookResult = true
} = {}) {
  return {
    getAll: jest.fn(async () => allBooks),
    getPrivate: jest.fn(async () => privateBooks),
    addBook: jest.fn(async () => addBookResult)
  };
}

describe("BooksController", () => {
  const allBooks = [
    { id: 1, name: "Hobbit", author: "Tolkien", ownerId: "postnikov" },
    { id: 2, name: "I, Robot", author: "Asimov", ownerId: "postnikov" }
  ];
  const privateBooks = [
    { id: 2, name: "I, Robot", author: "Asimov", ownerId: "postnikov" }
  ];

  it("loads all books into VM on init", async () => {
    const repository = createStubRepository({ allBooks, privateBooks });
    const controller = new BooksController(repository);

    await controller.init();

    expect(repository.getAll).toHaveBeenCalled();
    expect(controller.books).toEqual(allBooks);
    expect(controller.booksVm).toHaveLength(2);
    expect(controller.booksVm[0].displayText).toBe("Tolkien: Hobbit");
    expect(controller.privateBooksCount).toBe(1);
    expect(controller.filterMode).toBe("all");
  });

  it("switching to private loads private list", async () => {
    const repository = createStubRepository({ allBooks, privateBooks });
    const controller = new BooksController(repository);
    await controller.init();

    await controller.setFilterMode("private");

    expect(controller.filterMode).toBe("private");
    expect(repository.getPrivate).toHaveBeenCalled();
    expect(controller.books).toEqual(privateBooks);
    expect(controller.booksVm).toHaveLength(1);
  });

  it("filter modes are mutually exclusive", async () => {
    const repository = createStubRepository({ allBooks, privateBooks });
    const controller = new BooksController(repository);
    await controller.init();

    await controller.setFilterMode("private");
    expect(controller.filterMode).toBe("private");

    await controller.setFilterMode("all");
    expect(controller.filterMode).toBe("all");
    expect(controller.books).toEqual(allBooks);
  });

  it("addBook calls repository and refreshes list and private count", async () => {
    const repository = createStubRepository({
      allBooks,
      privateBooks,
      addBookResult: true
    });
    const controller = new BooksController(repository);
    await controller.init();

    const updatedPrivate = [
      ...privateBooks,
      { id: 3, name: "New", author: "Author", ownerId: "postnikov" }
    ];
    repository.getPrivate.mockResolvedValue(updatedPrivate);
    repository.getAll.mockResolvedValue([...allBooks, updatedPrivate[1]]);

    controller.setNewBookName("New");
    controller.setNewBookAuthor("Author");
    const success = await controller.addBook();

    expect(success).toBe(true);
    expect(repository.addBook).toHaveBeenCalledWith({
      name: "New",
      author: "Author"
    });
    expect(controller.privateBooksCount).toBe(2);
    expect(controller.books).toHaveLength(3);
  });

  it("clears form fields after successful add", async () => {
    const repository = createStubRepository({
      allBooks,
      privateBooks,
      addBookResult: true
    });
    const controller = new BooksController(repository);
    await controller.init();

    controller.setNewBookName("New");
    controller.setNewBookAuthor("Author");
    await controller.addBook();

    expect(controller.newBookName).toBe("");
    expect(controller.newBookAuthor).toBe("");
  });

  it("does not clear form when add fails", async () => {
    const repository = createStubRepository({
      allBooks,
      privateBooks,
      addBookResult: false
    });
    const controller = new BooksController(repository);
    await controller.init();

    controller.setNewBookName("New");
    controller.setNewBookAuthor("Author");
    const success = await controller.addBook();

    expect(success).toBe(false);
    expect(controller.newBookName).toBe("New");
    expect(controller.newBookAuthor).toBe("Author");
    expect(controller.errorMessage).toBe("Failed to add book");
  });
});
