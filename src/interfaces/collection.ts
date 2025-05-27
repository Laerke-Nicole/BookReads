export type Collection = {
    _userId: string;
    _bookId: string;
    status: 'to-read' | 'currently reading' | 'read';
    addedAt: Date;
}