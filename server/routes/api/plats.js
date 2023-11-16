const express = require('express');
const router = express.Router();
const plats = require('../../models/Plats');
const { verifyToken } = require('./jwt');

router.get('/', (req, res) => {
  plats.find()
    .then(plats => res.json(plats))
    .catch(err => res.status(404).json({ noplatsFound: 'Pas de plats trouvés...' }));
});

router.get('/disponible', (req, res) => {
  plats.find({ quantite: { $gt: 0 } }) 
    .then(plats => res.json(plats))
    .catch(err => res.status(404).json({ noplatsFound: 'Pas de plats trouvés...' }));
});

router.get('/nom/:nom', verifyToken, (req, res) => {
  const nom = req.params.nom;
  plats.find({ nom: nom })
    .then(plat => res.json(plat))
    .catch(err => res.status(404).json({ noPlatsFound: 'Pas de plat avec ce nom...' }));
});

router.get('/:id', verifyToken, (req, res) => {
  plats.findById(req.params.id)
    .then(plat => res.json(plat))
    .catch(err => res.status(404).json({ platNotFound: 'plat non trouvé...' }));
});

router.post('/Createplat', verifyToken, (req, res) => {
    console.log(req.body)
  plats.create(req.body)
    .then(plat => res.json({ msg: 'plat bien ajouté !' }))
    .catch(err => res.status(400).json({ error: 'Impossible d\'ajouter le plat' + err}));
});

router.put('/:id', verifyToken, (req, res) => {
  plats.findByIdAndUpdate(req.params.id, req.body)
    .then(plat => res.json({ msg: 'plat bien modifié!' }))
    .catch(err => res.status(400).json({ error: 'Erreur lors de la mise à jour du plat...' }));
});

router.delete('/:id', verifyToken, (req, res) => {
  plats.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: 'plat supprimé avec succès' }))
    .catch(err => res.status(404).json({ platNotFound: 'plat non trouvé...' }));
});

module.exports = router;