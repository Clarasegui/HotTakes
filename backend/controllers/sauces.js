const e = require("express");
const Sauce = require("../models/sauces");
const fs = require('fs');
const { abort } = require("process");

// Ajout d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => {
            res.status(400).json({ error });
        })
};

// Supression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non authorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`${__dirname}/../images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, sauceObject)
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Like d'une sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const userLiking = req.auth.userId
            const like = parseInt(req.body.like);
            if (like === 1 && !sauce.usersLiked.includes(userLiking)) {
                sauce.likes++
                sauce.usersLiked.push(userLiking)
                Sauce.updateOne({ _id: req.params.id }, sauce)
                    .then(() => res.status(200).json({ message: 'Sauce likée !' }))
                    .catch(error => res.status(401).json({ error }));
            } else if (like === -1 && !sauce.usersDisliked.includes(userLiking)) {
                sauce.dislikes++
                sauce.usersDisliked.push(userLiking)
                Sauce.updateOne({ _id: req.params.id }, sauce)
                    .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
                    .catch(error => res.status(401).json({ error }));
            } else if (like === 0) {
                if (sauce.usersLiked.includes(userLiking)) {
                    sauce.likes--
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userLiking), 1)
                    Sauce.updateOne({ _id: req.params.id }, sauce)
                        .then(() => res.status(200).json({ message: 'Like retiré !' }))
                        .catch(error => res.status(401).json({ error }));
                } else if (sauce.usersDisliked.includes(userLiking)) {
                    sauce.dislikes--
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userLiking), 1)
                    Sauce.updateOne({ _id: req.params.id }, sauce)
                        .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
                        .catch(error => res.status(401).json({ error }));
                } else {
                    res.status(400).json(Error("Wrong operation"));
                }
            } else {
                res.status(400).json(Error("Wrong operation"));
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error });
        });
};