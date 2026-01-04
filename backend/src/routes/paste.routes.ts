import { Router } from 'express';
import { PasteController } from '../controllers/paste.controller';

const router = Router();
const pasteController = new PasteController();

router.post('/pastes', pasteController.createPaste.bind(pasteController));
router.get('/pastes/:id', pasteController.getPaste.bind(pasteController));

export { router as pasteRoutes };