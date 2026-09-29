import React from "react";
import { observer } from "mobx-react";
import booksController from "./Books.controller";

function BooksView() {
  React.useEffect(() => {
    booksController.init();
  }, []);

  return (
    <div className="books">
      <div className="books-filter">
        <button
          type="button"
          className={booksController.allFilterClass}
          onClick={() => booksController.setFilterMode("all")}
        >
          All books
        </button>
        <button
          type="button"
          className={booksController.privateFilterClass}
          onClick={() => booksController.setFilterMode("private")}
        >
          Private books
        </button>
      </div>

      <div className="books-list">
        {booksController.booksVm.map((book) => (
          <div key={book.key}>{book.displayText}</div>
        ))}
      </div>

      <div className="books-add">
        <input
          type="text"
          placeholder="Name"
          value={booksController.newBookName}
          onChange={(e) => booksController.setNewBookName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          value={booksController.newBookAuthor}
          onChange={(e) => booksController.setNewBookAuthor(e.target.value)}
        />
        <button type="button" onClick={() => booksController.addBook()}>
          Add
        </button>
      </div>

      <div className="books-error">{booksController.errorMessage}</div>
    </div>
  );
}

export default observer(BooksView);
