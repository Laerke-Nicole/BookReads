export type Book = {
    _id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    imageURL: string;
    releaseYear: number;
    ishidden: boolean;
}

export type newBook = {
    title: string;
    author: string;
    description: string;
    genre: string;
    imageURL: string;
    releaseYear: number;
    ishidden: boolean;
}