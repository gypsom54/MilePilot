/**
 * MP-S6-001 — Business Workspace production data models (interfaces only)
 * No implementation, persistence, or calculations in Sprint 1.
 */
(function (global) {
  'use strict';

  var SCHEMA_VERSION = 1;

  /**
   * @typedef {Object} Expense
   * @property {string} id
   * @property {string} businessId
   * @property {string} createdISO
   * @property {string} updatedISO
   * @property {string} incurredISO
   * @property {number} amountPence
   * @property {string} currency
   * @property {string} category
   * @property {string} supplier
   * @property {string} supplierId
   * @property {string} description
   * @property {string} receiptReference
   * @property {'unknown'|'included'|'excluded'|'mixed'} vatStatus
   * @property {number} vatAmountPence
   * @property {number} businessPercentage
   * @property {string} notes
   * @property {string[]} tags
   * @property {'draft'|'confirmed'|'pending_receipt'} status
   * @property {Object[]} attachments
   * @property {boolean} archived
   * @property {boolean} deleted
   * @property {number} schemaVersion
   */

  /**
   * @typedef {Object} Receipt
   * @property {string} id
   * @property {string} expenseId
   * @property {string} capturedISO
   * @property {string} [imageRef]
   * @property {'pending'|'processed'|'failed'} ocrStatus
   * @property {number} schemaVersion
   */

  /**
   * @typedef {Object} Supplier
   * @property {string} id
   * @property {string} name
   * @property {string} [vatNumber]
   * @property {string} [email]
   * @property {number} schemaVersion
   */

  /**
   * @typedef {Object} VATRecord
   * @property {string} id
   * @property {string} periodStartISO
   * @property {string} periodEndISO
   * @property {number} outputVatPence
   * @property {number} inputVatPence
   * @property {'draft'|'submitted'|'paid'} status
   * @property {number} schemaVersion
   */

  /**
   * @typedef {Object} BusinessHealth
   * @property {string} id
   * @property {string} asOfISO
   * @property {number} score
   * @property {string[]} highlights
   * @property {number} schemaVersion
   */

  /**
   * @typedef {Object} AccountantPack
   * @property {string} id
   * @property {string} periodLabel
   * @property {string} generatedISO
   * @property {string[]} includedSections
   * @property {'draft'|'ready'|'sent'} status
   * @property {number} schemaVersion
   */

  var STORAGE_KEYS = {
    expenses: 'mp_expenses',
    expenseCategories: 'mp_expense_categories',
    expenseMeta: 'mp_expense_meta',
    receipts: 'mp_receipts',
    suppliers: 'mp_suppliers',
    vatPeriods: 'mp_vat_periods',
    businessHealth: 'mp_business_health',
    accountantPacks: 'mp_accountant_packs',
  };

  global.MPBusinessWorkspaceModels = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    STORAGE_KEYS: STORAGE_KEYS,
    /** @returns {Expense} */
    expenseShape: function () {
      return {
        id: '',
        businessId: 'default',
        createdISO: '',
        updatedISO: '',
        incurredISO: '',
        amountPence: 0,
        currency: 'GBP',
        category: 'Other',
        supplier: '',
        supplierId: '',
        description: '',
        receiptReference: '',
        vatStatus: 'unknown',
        vatAmountPence: 0,
        businessPercentage: 100,
        notes: '',
        tags: [],
        status: 'draft',
        attachments: [],
        archived: false,
        deleted: false,
        schemaVersion: SCHEMA_VERSION,
      };
    },
    /** @returns {Receipt} */
    receiptShape: function () {
      return {
        id: '',
        expenseId: '',
        capturedISO: '',
        imageRef: undefined,
        ocrStatus: 'pending',
        schemaVersion: SCHEMA_VERSION,
      };
    },
    /** @returns {Supplier} */
    supplierShape: function () {
      return { id: '', name: '', vatNumber: undefined, email: undefined, schemaVersion: SCHEMA_VERSION };
    },
    /** @returns {VATRecord} */
    vatRecordShape: function () {
      return {
        id: '',
        periodStartISO: '',
        periodEndISO: '',
        outputVatPence: 0,
        inputVatPence: 0,
        status: 'draft',
        schemaVersion: SCHEMA_VERSION,
      };
    },
    /** @returns {BusinessHealth} */
    businessHealthShape: function () {
      return { id: '', asOfISO: '', score: 0, highlights: [], schemaVersion: SCHEMA_VERSION };
    },
    /** @returns {AccountantPack} */
    accountantPackShape: function () {
      return {
        id: '',
        periodLabel: '',
        generatedISO: '',
        includedSections: [],
        status: 'draft',
        schemaVersion: SCHEMA_VERSION,
      };
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
