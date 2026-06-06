import express from 'express';
import { authenticate, authorize } from '../middleware.js';
import * as journalService from '../services/journalService.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const id = await journalService.createJournalEntry({
      ...req.body,
      created_by: req.user.id
    });
    res.json({ id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const entries = await journalService.getJournalEntries(req.query);
    res.json(entries);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const entry = await journalService.getJournalEntry(req.params.id);
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/post', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    await journalService.postJournalEntry(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
