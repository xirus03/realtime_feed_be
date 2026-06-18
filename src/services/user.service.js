import * as Users from '../db/queries/user.queries.js';

export const createUser = async (userData) => {
    try {
        const newUser = await Users.create(userData);
        return newUser;
    }  catch (error) {
        throw error;
    }   
};

export const getAllUsers = async () => {
    try {
        const users = await Users.getAll();
        return users;
    } catch (error) {
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const user = await Users.getbyid(id);
        return user;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const updatedUser = await Users.update(id, userData);
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const deletedUser = await Users.deleteUser(id);
        return deletedUser;
    } catch (error) {
        throw error;
    }
};

export const findUserByUsernameOrEmail = async (username, email) => {
    try {
        const user = await Users.findUserByUsernameOrEmail(username, email);
        return user;
    } catch (error) {
        throw error;
    }
};