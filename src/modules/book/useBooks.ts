import { ref } from 'vue';
import type { Book, newBook } from '../../interfaces/book';

export const useBooks = () => {
    const error = ref<string | null>(null);
    const loading = ref<boolean>(false);
    const books = ref<Book[]>([]);

    // fetch books
    const fetchBooks = async (): Promise<void> => {
        loading.value = true;

        try {
            const response = await fetch('https://mongodbapi-w61d.onrender.com/api/books');
            if (!response.ok) {
                throw new Error('No data available');
            }

            const data: Book[] = await response.json();

            books.value = data;
            console.log("books fetched", books.value);
        } 
        catch (err) {
            error.value = (err as Error).message;
        } 
        finally {
            loading.value = false; // always set loading to false
        }
    }


    // get token and user ID
    const getTokenAndUserId = (): { token: string, userId: string } => {
        const token = localStorage.getItem('isToken');
        const userId = localStorage.getItem('userIDToken');

        if (!token) {
            throw new Error('No token available');
        }
        if (!userId) {
            throw new Error('No user ID available');
        }
        return { token, userId };
    }


    // validate book
    const validateBook = (book: newBook): void => {
        if (book.title) {
            throw new Error('book title is required');
        }
    }


    // set default values
    const setDefaultValues = (book: newBook, userId: string) => {
        return {
            title: book.title || 'New Book Title',
            author: book.author || 'New Author',
            description: book.description || 'New book description default',
            genre: book.genre || 'Fiction',
            imageURL: book.imageURL || 'https://picsum.photos/500/500',
            releaseYear: book.releaseYear || new Date().getFullYear(),
            idHidden: book.ishidden || false
        }
    }


    // add book
    const addBook = async (book: newBook): Promise<void> => {
        try {
            const { token, userId } = getTokenAndUserId();
            validateBook(book)
            const bookWithDefaults = setDefaultValues(book, userId);

            const response = await fetch('https://mongodbapi-w61d.onrender.com/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify(bookWithDefaults)
            })

            if (!response.ok) {
                // prints out the specific error message from the server
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'No data available');
            }

            const newBook: Book = await response.json();
            books.value.push(newBook);
            console.log("book added", newBook);
            await fetchBooks();
        }   
        catch (err) {
            error.value = (err as Error).message;
        }
    }


    const deleteBookFromServer = async (id: string, token: string): Promise<void> => {
        const response = await fetch(`https://mongodbapi-w61d.onrender.com/api/books/${id}`, {
            method: 'DELETE',
            headers: {
                'auth-token': token
            }
        })

        if (!response.ok) {
            console.log('Error deleting book');
            throw new Error('No data available');
        }
    }

    const removeBookFromState = (id: string): void => {
        books.value = books.value.filter(book => book._id !== id);
        console.log("books deleted", id);
    }


    // delete book
    const deleteBook = async (id: string): Promise<void> => {
        try {
            // check if user is logged in to give access to delete
            const { token } = getTokenAndUserId();
            await deleteBookFromServer(id, token);
            removeBookFromState(id);

            console.log("id test", id);
        }
        catch (err) {
            error.value = (err as Error).message;
        }
    }

    const updateBookOnServer = async ( id: string, updatedBook: Partial<Book>, token: string ): Promise<Book> => {
        const response = await fetch(`https://mongodbapi-w61d.onrender.com/api/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(updatedBook)
        })
        if (!response.ok) {
            throw new Error('No data available');
        }

        const responseText = await response.text();
        try {
            return JSON.parse(responseText);
        }
        catch {
            // convert into an unknown
            return { message: responseText } as unknown as Book;
        }
        // convert into json cuz it cant read javascript
        // return await response.json();
    }

    const updateBookInState = (id: string, updatedBook: Book) => {
        const index = books.value.findIndex(book => book._id === id);
        // if index is not found. if id is not -1 the book is found
        if (index !== -1) {
            books.value[index] = updatedBook;
        }
    }

    const updatedBook = async (id: string, updatedBook: Partial<Book>): Promise<void> => {
        try {
            const { token } = getTokenAndUserId();
            const updatedBookResponse = await updateBookOnServer(id, updatedBook, token);
            updateBookInState(id, updatedBookResponse);
            await fetchBooks();
        }
        catch (err) {
            error.value = (err as Error).message;
        }
    }

    // filter correct things
    const fetchBookById = async(id: string): Promise<Book[] | null> => {
        try {
            const response = await fetch(`https://mongodbapi-w61d.onrender.com/api/books/${id}`);
            if (!response.ok) {
                throw new Error('No data available');
            }

            const data: Book[] = await response.json();
            console.log("Books fetched", data);
            // return data/ Book if it exists
            return data;
        }
        catch (err) {
            console.log(err);
            // if its null then return null since fetchBookById can either be null or Book[]
            return null;
        }
    }

    return { 
        error, 
        loading, 
        books, 
        fetchBooks,
        deleteBook,
        addBook,
        updatedBook,
        getTokenAndUserId,
        fetchBookById
    }
}