import React from "react";
import HeaderView from "./Header/Header.view";
import BooksView from "./Books/Books.view";

function AppView() {
  return (
    <div className="App">
      <HeaderView />
      <main className="app-main">
        <BooksView />
      </main>
    </div>
  );
}

export default AppView;
