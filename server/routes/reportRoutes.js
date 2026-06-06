import express from 'express';
import { authenticate } from '../middleware.js';
import * as reportService from '../services/reportService.js';

const router = express.Router();

router.get('/trial-balance', authenticate, async (req, res) => {
  try {
    const data = await reportService.getTrialBalance();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/balance-sheet', authenticate, async (req, res) => {
  try {
    const data = await reportService.getBalanceSheet();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/income-statement', authenticate, async (req, res) => {
  try {
    const data = await reportService.getIncomeStatement();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/ledger/:accountId', authenticate, async (req, res) => {
  try {
    const data = await reportService.getLedger(req.params.accountId);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
