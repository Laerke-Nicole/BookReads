import { User } from './auth';
import { Book } from './book';

export type Review = {
    id: string;
    _book: Book["_id"];
    _createdBy: User["_id"];
    rating: number;
    comment: string;
    createdAt: Date;
}