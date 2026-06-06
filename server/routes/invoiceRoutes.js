import express from 'express';
import { authenticate, authorize } from '../middleware.js';
import * as invoiceService from '../services/invoiceService.js';

const router = express.Router();

router.post('/', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const id = await invoiceService.createInvoice(req.body, req.user.id);
    res.json({ id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoices();
    res.json(invoices);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoice(req.params.id);
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    await invoiceService.updateInvoice(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/post', authenticate, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const journalId = await invoiceService.postInvoice(req.params.id, req.user.id);
    res.json({ journalId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
