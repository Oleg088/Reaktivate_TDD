import ApiGateway from "../Shared/ApiGateway.js";

class BooksRepository {
  constructor(httpGateway) {
    this.httpGateway = httpGateway || new ApiGateway();
  }

  mapDtoToPm = (dto) => ({
    id: dto.id,
    name: dto.name || "",
    author: dto.author || "",
    ownerId: dto.ownerId
  });

  getAll = async () => {
    const booksDto = await this.httpGateway.get("/");
    return (booksDto || []).map(this.mapDtoToPm);
  };

  getPrivate = async () => {
    const booksDto = await this.httpGateway.get("/private");
    return (booksDto || []).map(this.mapDtoToPm);
  };

  addBook = async ({ name, author }) => {
    const bookAddDto = await this.httpGateway.post("/", { name, author });
    return bookAddDto && bookAddDto.status === "ok";
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
export { BooksRepository };
