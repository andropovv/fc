import React from "react";
import { useParams, useHistory } from "react-router-dom";
import EditUserPage from "../components/page/editUserPage";
import UserPage from "../components/page/userPage";
import UsersListPage from "../components/page/usersListPage";
import UserProvider from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";

const Users = () => {
    const history = useHistory();
    const { currentUser } = useAuth();
    const params = useParams();
    const { userId, edit } = params;

    if (userId !== currentUser._id && edit) {
        history.push(`/users/${currentUser._id}/edit`);
    }
    return (
        <>
            <UserProvider>
                {userId ? (
                    edit ? (
                        <EditUserPage />
                    ) : (
                        <UserPage userId={userId} />
                    )
                ) : (
                    <UsersListPage />
                )}
            </UserProvider>
        </>
    );
};

export default Users;
