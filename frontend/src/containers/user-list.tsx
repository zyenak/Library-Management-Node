import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/user-context";
import CustomForm, { FormField } from "../components/forms/custom-form";
import withInputValidation from '../hoc/input-error-handling';

const UserFormContainer: React.FC = () => {
    const { addUser } = useUser();
    const navigate = useNavigate();

    const handleUserSubmit = (data: any) => {
        addUser(data);
        navigate("/users");
    };

    const userFields: FormField[] = [
        { label: "Username", name: "username", type: "text", required: true },
        { label: "Password", name: "password", type: "password", required: true },
        { label: "Role", name: "role", type: "text", required: true },
    ];

    // Wrap CustomForm with withInputValidation HOC
    const ValidatedUserForm = withInputValidation(CustomForm);

    // Define initialData internally
    const initialData = {
        username: "",
        password: "",
        role: "user",
    };

    return (
        <ValidatedUserForm
            formType="user"
            initialData={initialData}
            toUpdate={false}
            onSubmit={handleUserSubmit}
            fields={userFields}
            validateForm={(formData: any) => true} 
            errors={{}}
        />
    );
};

export default UserFormContainer;
