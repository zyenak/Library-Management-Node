import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BooksContext } from "../context/books-context";
import CustomForm, { FormField } from "../components/forms/custom-form";
import WithAdminProtector from "../middleware/admin-protector";
import { WithLoginProtector } from "../middleware/login-protector";
import withInputValidation from '../hoc/input-error-handling';

const EditBookFormContainer: React.FC = () => {
    const { bookIsbn } = useParams();
    const { books, updateBook } = useContext(BooksContext);
    const navigate = useNavigate();

    // Find the book by isbn
    const bookToUpdate = books.find((book) => book.isbn === bookIsbn);

    if (!bookToUpdate) {
        return <div>Book not found</div>;
    }

    const handleBookSubmit = (data: any) => {
        updateBook(data);
        navigate("");
    };

    const bookFields: FormField[] = [
        { label: "Name", name: "name", type: "text", required: true },
        { label: "ISBN", name: "isbn", type: "text", required: true },
        { label: "Category", name: "category", type: "select", required: true, options: ["Sci-Fi", "Action", "Adventure", "Horror", "Romance", "Mystery", "Thriller", "Drama", "Fantasy", "Comedy"] },
        { label: "Price", name: "price", type: "number", required: true },
        { label: "Quantity", name: "quantity", type: "number", required: true },
    ];

    // Wrap CustomForm with withInputValidation HOC
    const ValidatedBookForm = withInputValidation(CustomForm);

    // Define initialData internally
    const initialData = {
        ...bookToUpdate,
        toUpdate: true,
    };

    return (


        <ValidatedBookForm
            formType="book"
            initialData={initialData}
            toUpdate={true}
            onSubmit={handleBookSubmit}
            fields={bookFields}
            validateForm={(formData: any) => true} 
            errors={{}} 
        />
    );
};

export default EditBookFormContainer;
