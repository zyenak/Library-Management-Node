import User from './user';
import Book from './book';

// Define associations
User.belongsToMany(Book, { through: 'UserBooks', as: 'borrowedBooks' });
Book.belongsToMany(User, { through: 'UserBooks' });

export { User, Book };