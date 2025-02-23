import express from 'express';
import { allOffers, domesticOffers, internationalOffers, percentageOffers } from "../Controllers/offersController.js";

const router = express.Router();

router.get('/percentageOffers',percentageOffers);

router.get('/internationalOffers',internationalOffers);

router.get('/domesticOffers',domesticOffers);

router.get('/allOffers',allOffers);


export default router;