import express from 'express';
import { authenticate, authorize } from '../middleware.js';
import * as chartService from '../services/chartService.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const id = await chartService.createAccount(req.body);
    res.json({ id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const accounts = await chartService.getAccounts();
    res.json(accounts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/hierarchy', authenticate, async (req, res) => {
  try {
    const hierarchy = await chartService.getAccountHierarchy();
    res.json(hierarchy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const account = await chartService.getAccount(req.params.id);
    res.json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    await chartService.updateAccount(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await chartService.deleteAccount(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
