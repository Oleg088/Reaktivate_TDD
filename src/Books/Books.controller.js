import { makeAutoObservable, runInAction } from "mobx";
import booksRepository from "./Books.repository";

class BooksController {
  books = [];
  filterMode = "all";
  privateBooksCount = 0;
  newBookName = "";
  newBookAuthor = "";
  isLoading = false;
  error = null;

  constructor(repository = booksRepository) {
    this.repository = repository;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get booksVm() {
    return this.books.map((book, index) => ({
      key: book.id != null ? String(book.id) : `book-${index}`,
      name: book.name,
      author: book.author,
      displayText: `${book.author}: ${book.name}`
    }));
  }

  get allFilterClass() {
    return this.filterMode === "all" ? "filter-btn active" : "filter-btn";
  }

  get privateFilterClass() {
    return this.filterMode === "private" ? "filter-btn active" : "filter-btn";
  }

  get errorMessage() {
    return this.error || "";
  }

  setNewBookName(value) {
    this.newBookName = value;
  }

  setNewBookAuthor(value) {
    this.newBookAuthor = value;
  }

  async init() {
    await this.loadBooks();
  }

  async loadBooks() {
    this.isLoading = true;
    this.error = null;
    try {
      const [books, privateBooks] = await Promise.all([
        this.filterMode === "private"
          ? this.repository.getPrivate()
          : this.repository.getAll(),
        this.repository.getPrivate()
      ]);
      runInAction(() => {
        this.books = books;
        this.privateBooksCount = privateBooks.length;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Failed to load books";
        this.isLoading = false;
      });
    }
  }

  async setFilterMode(mode) {
    if (mode !== "all" && mode !== "private") {
      return;
    }
    this.filterMode = mode;
    await this.loadBooks();
  }

  async addBook() {
    const name = this.newBookName.trim();
    const author = this.newBookAuthor.trim();
    if (!name || !author) {
      return false;
    }

    this.isLoading = true;
    this.error = null;
    try {
      const success = await this.repository.addBook({ name, author });
      if (!success) {
        runInAction(() => {
          this.error = "Failed to add book";
          this.isLoading = false;
        });
        return false;
      }
      runInAction(() => {
        this.newBookName = "";
        this.newBookAuthor = "";
      });
      await this.loadBooks();
      return true;
    } catch (err) {
      runInAction(() => {
        this.error = err.message || "Failed to add book";
        this.isLoading = false;
      });
      return false;
    }
  }
}

const booksController = new BooksController();
export default booksController;
export { BooksController };
