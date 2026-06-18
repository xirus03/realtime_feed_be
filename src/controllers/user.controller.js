import * as UsersServices from '../services/user.service.js';

export const create = async (req, res) => {
    try {
        const newUser = await UsersServices.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getall = async (req, res) => {
    try {
        const users = await UsersServices.getall();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getbyid = async (req, res) => {
    try {
        const user = await UsersServices.getbyid(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const updatedUser = await UsersServices.update(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteuser = async (req, res) => {
    try {
        const deletedUser = await UsersServices.deleteuser(req.params.id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const profile = async (req, res) => {
    res.json({
        message: `Hello, ${req.user.username}! This is your profile.`,
        user: req.user,
    });
}

export const findbyusernameoremail = async (req, res) => {
    try {
        const { username, email } = req.query;
        const users = await UsersServices.findUserByUsernameOrEmail(username, email);
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};