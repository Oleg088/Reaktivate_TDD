import React from "react";
import { observer } from "mobx-react";
import booksController from "../Books/Books.controller";

function HeaderView() {
  return (
    <header className="app-header">
      Your books: {booksController.privateBooksCount}
    </header>
  );
}

export default observer(HeaderView);
