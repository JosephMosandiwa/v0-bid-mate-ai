-- ============================================
-- SEED SA TENDER FORM TEMPLATES
-- DocuMind Engine - Version 1.0.0
-- ============================================

-- SBD1 - Invitation to Bid
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Invitation to Bid', 'SBD1', 'SA Government Tender', 'Standard Bidding Document',
  'sbd1_structure_v1', 'sbd1_layout_v1', 0.75,
  '[
    {"field_id": "bid_number", "field_name": "Bid Number", "label_pattern": "BID NUMBER|TENDER NUMBER", "page": 1, "position_normalized": {"x": 0.5, "y": 0.15, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "closing_date", "field_name": "Closing Date", "label_pattern": "CLOSING DATE|CLOSE DATE", "page": 1, "position_normalized": {"x": 0.5, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null},
    {"field_id": "closing_time", "field_name": "Closing Time", "label_pattern": "CLOSING TIME|TIME", "page": 1, "position_normalized": {"x": 0.5, "y": 0.25, "width": 0.2, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER NAME|COMPANY NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.4, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "contact_person", "field_name": "Contact Person", "label_pattern": "CONTACT PERSON|CONTACT NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.45, "width": 0.4, "height": 0.03}, "data_type": "name", "is_required": true, "profile_mapping": "contact_person"},
    {"field_id": "telephone", "field_name": "Telephone Number", "label_pattern": "TELEPHONE|TEL|PHONE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.5, "width": 0.3, "height": 0.03}, "data_type": "phone", "is_required": true, "profile_mapping": "telephone"},
    {"field_id": "fax", "field_name": "Fax Number", "label_pattern": "FAX|FACSIMILE", "page": 1, "position_normalized": {"x": 0.5, "y": 0.5, "width": 0.3, "height": 0.03}, "data_type": "phone", "is_required": false, "profile_mapping": "fax"},
    {"field_id": "email", "field_name": "Email Address", "label_pattern": "E-MAIL|EMAIL", "page": 1, "position_normalized": {"x": 0.1, "y": 0.55, "width": 0.4, "height": 0.03}, "data_type": "email", "is_required": true, "profile_mapping": "email"},
    {"field_id": "postal_address", "field_name": "Postal Address", "label_pattern": "POSTAL ADDRESS|P\\.?O\\.? BOX", "page": 1, "position_normalized": {"x": 0.1, "y": 0.6, "width": 0.8, "height": 0.06}, "data_type": "address", "is_required": true, "profile_mapping": "postal_address"},
    {"field_id": "physical_address", "field_name": "Physical Address", "label_pattern": "PHYSICAL ADDRESS|STREET ADDRESS", "page": 1, "position_normalized": {"x": 0.1, "y": 0.7, "width": 0.8, "height": 0.06}, "data_type": "address", "is_required": true, "profile_mapping": "physical_address"}
  ]'::jsonb,
  2, 'Standard Bidding Document 1 - Invitation to Bid form used in South African government tenders', '2023',
  true, true, 'system'
);

-- SBD3.1 - Pricing Schedule (Firm Prices)
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Pricing Schedule - Firm Prices', 'SBD3.1', 'SA Government Tender', 'Standard Bidding Document',
  'sbd3_1_structure_v1', 'sbd3_1_layout_v1', 0.75,
  '[
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "bid_number", "field_name": "Bid Number", "label_pattern": "BID NUMBER|TENDER NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "total_exclusive", "field_name": "Total Exclusive of VAT", "label_pattern": "TOTAL.*EXCLUSIVE|EXCL.*VAT|SUBTOTAL", "page": 1, "position_normalized": {"x": 0.6, "y": 0.8, "width": 0.3, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null},
    {"field_id": "vat_amount", "field_name": "VAT Amount", "label_pattern": "VAT|VALUE ADDED TAX", "page": 1, "position_normalized": {"x": 0.6, "y": 0.85, "width": 0.3, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null},
    {"field_id": "total_inclusive", "field_name": "Total Inclusive of VAT", "label_pattern": "TOTAL.*INCLUSIVE|INCL.*VAT|GRAND TOTAL", "page": 1, "position_normalized": {"x": 0.6, "y": 0.9, "width": 0.3, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  1, 'Standard Bidding Document 3.1 - Pricing Schedule for firm/fixed prices', '2023',
  true, true, 'system'
);

-- SBD4 - Declaration of Interest
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Declaration of Interest', 'SBD4', 'SA Government Tender', 'Standard Bidding Document',
  'sbd4_structure_v1', 'sbd4_layout_v1', 0.75,
  '[
    {"field_id": "bidder_name", "field_name": "Full Name of Bidder", "label_pattern": "FULL NAME.*BIDDER|NAME OF BIDDER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "id_number", "field_name": "Identity Number", "label_pattern": "IDENTITY NUMBER|ID NUMBER|ID NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "id_number", "is_required": true, "profile_mapping": "director_id"},
    {"field_id": "position", "field_name": "Position", "label_pattern": "POSITION|DESIGNATION", "page": 1, "position_normalized": {"x": 0.5, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "contact_position"},
    {"field_id": "registration_number", "field_name": "Company Registration Number", "label_pattern": "REGISTRATION NUMBER|REG.*NO|COMPANY.*NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.25, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "registration_number"},
    {"field_id": "tax_reference", "field_name": "Tax Reference Number", "label_pattern": "TAX REFERENCE|TAX.*NO|TAX NUMBER", "page": 1, "position_normalized": {"x": 0.5, "y": 0.25, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "tax_number"},
    {"field_id": "vat_number", "field_name": "VAT Registration Number", "label_pattern": "VAT.*NUMBER|VAT.*REG|VAT NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.3, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": false, "profile_mapping": "vat_number"},
    {"field_id": "q1_employed", "field_name": "Are you employed by the state?", "label_pattern": "EMPLOYED.*STATE|STATE.*EMPLOYEE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.4, "width": 0.8, "height": 0.03}, "data_type": "checkbox", "is_required": true, "profile_mapping": null},
    {"field_id": "q2_board_member", "field_name": "Board member of state entity?", "label_pattern": "BOARD.*MEMBER|DIRECTOR.*STATE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.45, "width": 0.8, "height": 0.03}, "data_type": "checkbox", "is_required": true, "profile_mapping": null},
    {"field_id": "signature", "field_name": "Signature", "label_pattern": "SIGNATURE", "page": 2, "position_normalized": {"x": 0.1, "y": 0.8, "width": 0.3, "height": 0.05}, "data_type": "signature", "is_required": true, "profile_mapping": null},
    {"field_id": "date_signed", "field_name": "Date", "label_pattern": "DATE", "page": 2, "position_normalized": {"x": 0.6, "y": 0.8, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  3, 'Standard Bidding Document 4 - Declaration of Interest form to disclose conflicts of interest', '2023',
  true, true, 'system'
);

-- SBD6.1 - Preference Points Claim Form
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Preference Points Claim Form', 'SBD6.1', 'SA Government Tender', 'Standard Bidding Document',
  'sbd6_1_structure_v1', 'sbd6_1_layout_v1', 0.75,
  '[
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "bid_number", "field_name": "Bid Number", "label_pattern": "BID NUMBER|TENDER NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "total_bid_price", "field_name": "Total Bid Price", "label_pattern": "TOTAL BID PRICE|BID PRICE|TENDER PRICE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.25, "width": 0.4, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null},
    {"field_id": "bbbee_level", "field_name": "B-BBEE Status Level", "label_pattern": "B-BBEE.*LEVEL|BBBEE.*STATUS|BEE LEVEL", "page": 1, "position_normalized": {"x": 0.1, "y": 0.35, "width": 0.3, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "bbbee_level"},
    {"field_id": "bbbee_certificate", "field_name": "B-BBEE Certificate Number", "label_pattern": "CERTIFICATE.*NUMBER|CERT.*NO", "page": 1, "position_normalized": {"x": 0.5, "y": 0.35, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "bbbee_certificate_number"},
    {"field_id": "verification_agency", "field_name": "Verification Agency", "label_pattern": "VERIFICATION AGENCY|ISSUING AGENCY|AGENCY", "page": 1, "position_normalized": {"x": 0.1, "y": 0.4, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "bbbee_verification_agency"},
    {"field_id": "issue_date", "field_name": "Date of Issue", "label_pattern": "DATE.*ISSUE|ISSUE DATE|ISSUED ON", "page": 1, "position_normalized": {"x": 0.5, "y": 0.4, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": "bbbee_issue_date"},
    {"field_id": "expiry_date", "field_name": "Expiry Date", "label_pattern": "EXPIRY DATE|VALID UNTIL|EXPIRES", "page": 1, "position_normalized": {"x": 0.7, "y": 0.4, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": "bbbee_expiry_date"},
    {"field_id": "signature", "field_name": "Signature", "label_pattern": "SIGNATURE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.85, "width": 0.3, "height": 0.05}, "data_type": "signature", "is_required": true, "profile_mapping": null},
    {"field_id": "date_signed", "field_name": "Date", "label_pattern": "DATE", "page": 1, "position_normalized": {"x": 0.6, "y": 0.85, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  2, 'Standard Bidding Document 6.1 - Preference Points Claim Form for B-BBEE status', '2023',
  true, true, 'system'
);

-- SBD8 - Declaration of Bidders Past SCM Practices
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Declaration of Past SCM Practices', 'SBD8', 'SA Government Tender', 'Standard Bidding Document',
  'sbd8_structure_v1', 'sbd8_layout_v1', 0.75,
  '[
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "q1_abused_scm", "field_name": "Abused SCM system?", "label_pattern": "ABUSE.*SCM|SCM.*SYSTEM.*ABUSE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.3, "width": 0.8, "height": 0.03}, "data_type": "checkbox", "is_required": true, "profile_mapping": null},
    {"field_id": "q2_convicted_fraud", "field_name": "Convicted for fraud?", "label_pattern": "CONVICTED.*FRAUD|FRAUD.*CONVICTION", "page": 1, "position_normalized": {"x": 0.1, "y": 0.4, "width": 0.8, "height": 0.03}, "data_type": "checkbox", "is_required": true, "profile_mapping": null},
    {"field_id": "q3_listed_database", "field_name": "Listed on database of restricted suppliers?", "label_pattern": "RESTRICTED.*SUPPLIER|DATABASE.*RESTRICTED", "page": 1, "position_normalized": {"x": 0.1, "y": 0.5, "width": 0.8, "height": 0.03}, "data_type": "checkbox", "is_required": true, "profile_mapping": null},
    {"field_id": "signature", "field_name": "Signature", "label_pattern": "SIGNATURE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.8, "width": 0.3, "height": 0.05}, "data_type": "signature", "is_required": true, "profile_mapping": null},
    {"field_id": "date_signed", "field_name": "Date", "label_pattern": "DATE", "page": 1, "position_normalized": {"x": 0.6, "y": 0.8, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  1, 'Standard Bidding Document 8 - Declaration of Bidders Past Supply Chain Management Practices', '2023',
  true, true, 'system'
);

-- SBD9 - Certificate of Independent Bid Determination
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Certificate of Independent Bid Determination', 'SBD9', 'SA Government Tender', 'Standard Bidding Document',
  'sbd9_structure_v1', 'sbd9_layout_v1', 0.75,
  '[
    {"field_id": "bid_number", "field_name": "Bid Number", "label_pattern": "BID NUMBER|TENDER NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "authorized_signatory", "field_name": "Authorized Signatory", "label_pattern": "AUTHORIZED.*SIGNATORY|AUTHORISED.*SIGNATORY|DULY AUTHORISED", "page": 1, "position_normalized": {"x": 0.1, "y": 0.7, "width": 0.4, "height": 0.03}, "data_type": "name", "is_required": true, "profile_mapping": "authorized_signatory"},
    {"field_id": "signatory_position", "field_name": "Position", "label_pattern": "POSITION|CAPACITY|DESIGNATION", "page": 1, "position_normalized": {"x": 0.5, "y": 0.7, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "contact_position"},
    {"field_id": "signature", "field_name": "Signature", "label_pattern": "SIGNATURE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.8, "width": 0.3, "height": 0.05}, "data_type": "signature", "is_required": true, "profile_mapping": null},
    {"field_id": "date_signed", "field_name": "Date", "label_pattern": "DATE", "page": 1, "position_normalized": {"x": 0.6, "y": 0.8, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  2, 'Standard Bidding Document 9 - Certificate of Independent Bid Determination', '2023',
  true, true, 'system'
);

-- MBD1 - Municipal Invitation to Bid
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Municipal Invitation to Bid', 'MBD1', 'SA Municipal Tender', 'Municipal Bidding Document',
  'mbd1_structure_v1', 'mbd1_layout_v1', 0.75,
  '[
    {"field_id": "bid_number", "field_name": "Bid Number", "label_pattern": "BID NUMBER|TENDER NUMBER|CONTRACT.*NO", "page": 1, "position_normalized": {"x": 0.5, "y": 0.15, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "closing_date", "field_name": "Closing Date", "label_pattern": "CLOSING DATE|CLOSE DATE", "page": 1, "position_normalized": {"x": 0.5, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null},
    {"field_id": "closing_time", "field_name": "Closing Time", "label_pattern": "CLOSING TIME|TIME", "page": 1, "position_normalized": {"x": 0.5, "y": 0.25, "width": 0.2, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER NAME|COMPANY NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.4, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "contact_person", "field_name": "Contact Person", "label_pattern": "CONTACT PERSON|CONTACT NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.45, "width": 0.4, "height": 0.03}, "data_type": "name", "is_required": true, "profile_mapping": "contact_person"},
    {"field_id": "telephone", "field_name": "Telephone Number", "label_pattern": "TELEPHONE|TEL|PHONE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.5, "width": 0.3, "height": 0.03}, "data_type": "phone", "is_required": true, "profile_mapping": "telephone"},
    {"field_id": "cellphone", "field_name": "Cellphone Number", "label_pattern": "CELL|MOBILE|CELLPHONE", "page": 1, "position_normalized": {"x": 0.5, "y": 0.5, "width": 0.3, "height": 0.03}, "data_type": "phone", "is_required": false, "profile_mapping": "cellphone"},
    {"field_id": "email", "field_name": "Email Address", "label_pattern": "E-MAIL|EMAIL", "page": 1, "position_normalized": {"x": 0.1, "y": 0.55, "width": 0.4, "height": 0.03}, "data_type": "email", "is_required": true, "profile_mapping": "email"},
    {"field_id": "postal_address", "field_name": "Postal Address", "label_pattern": "POSTAL ADDRESS|P\\.?O\\.? BOX", "page": 1, "position_normalized": {"x": 0.1, "y": 0.6, "width": 0.8, "height": 0.06}, "data_type": "address", "is_required": true, "profile_mapping": "postal_address"},
    {"field_id": "physical_address", "field_name": "Physical Address", "label_pattern": "PHYSICAL ADDRESS|STREET ADDRESS", "page": 1, "position_normalized": {"x": 0.1, "y": 0.7, "width": 0.8, "height": 0.06}, "data_type": "address", "is_required": true, "profile_mapping": "physical_address"}
  ]'::jsonb,
  2, 'Municipal Bidding Document 1 - Municipal Invitation to Bid form', '2023',
  true, true, 'system'
);

-- MBD4 - Municipal Declaration of Interest
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Municipal Declaration of Interest', 'MBD4', 'SA Municipal Tender', 'Municipal Bidding Document',
  'mbd4_structure_v1', 'mbd4_layout_v1', 0.75,
  '[
    {"field_id": "bidder_name", "field_name": "Full Name of Bidder", "label_pattern": "FULL NAME.*BIDDER|NAME OF BIDDER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "id_number", "field_name": "Identity Number", "label_pattern": "IDENTITY NUMBER|ID NUMBER|ID NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "id_number", "is_required": true, "profile_mapping": "director_id"},
    {"field_id": "position", "field_name": "Position", "label_pattern": "POSITION|DESIGNATION", "page": 1, "position_normalized": {"x": 0.5, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "contact_position"},
    {"field_id": "registration_number", "field_name": "Company Registration Number", "label_pattern": "REGISTRATION NUMBER|REG.*NO|COMPANY.*NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.25, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "registration_number"},
    {"field_id": "tax_reference", "field_name": "Tax Reference Number", "label_pattern": "TAX REFERENCE|TAX.*NO|TAX NUMBER", "page": 1, "position_normalized": {"x": 0.5, "y": 0.25, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "tax_number"},
    {"field_id": "vat_number", "field_name": "VAT Registration Number", "label_pattern": "VAT.*NUMBER|VAT.*REG|VAT NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.3, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": false, "profile_mapping": "vat_number"},
    {"field_id": "signature", "field_name": "Signature", "label_pattern": "SIGNATURE", "page": 2, "position_normalized": {"x": 0.1, "y": 0.8, "width": 0.3, "height": 0.05}, "data_type": "signature", "is_required": true, "profile_mapping": null},
    {"field_id": "date_signed", "field_name": "Date", "label_pattern": "DATE", "page": 2, "position_normalized": {"x": 0.6, "y": 0.8, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  3, 'Municipal Bidding Document 4 - Municipal Declaration of Interest form', '2023',
  true, true, 'system'
);

-- MBD9 - Municipal Certificate of Independent Bid Determination
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Municipal Certificate of Independent Bid', 'MBD9', 'SA Municipal Tender', 'Municipal Bidding Document',
  'mbd9_structure_v1', 'mbd9_layout_v1', 0.75,
  '[
    {"field_id": "bid_number", "field_name": "Bid Number", "label_pattern": "BID NUMBER|TENDER NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "authorized_signatory", "field_name": "Authorized Signatory", "label_pattern": "AUTHORIZED.*SIGNATORY|AUTHORISED.*SIGNATORY|DULY AUTHORISED", "page": 1, "position_normalized": {"x": 0.1, "y": 0.7, "width": 0.4, "height": 0.03}, "data_type": "name", "is_required": true, "profile_mapping": "authorized_signatory"},
    {"field_id": "signatory_position", "field_name": "Position", "label_pattern": "POSITION|CAPACITY|DESIGNATION", "page": 1, "position_normalized": {"x": 0.5, "y": 0.7, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "contact_position"},
    {"field_id": "signature", "field_name": "Signature", "label_pattern": "SIGNATURE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.8, "width": 0.3, "height": 0.05}, "data_type": "signature", "is_required": true, "profile_mapping": null},
    {"field_id": "date_signed", "field_name": "Date", "label_pattern": "DATE", "page": 1, "position_normalized": {"x": 0.6, "y": 0.8, "width": 0.2, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  2, 'Municipal Bidding Document 9 - Municipal Certificate of Independent Bid Determination', '2023',
  true, true, 'system'
);

-- CSD - Central Supplier Database Form
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Central Supplier Database Form', 'CSD', 'SA Government Tender', 'Registration',
  'csd_structure_v1', 'csd_layout_v1', 0.70,
  '[
    {"field_id": "csd_number", "field_name": "CSD Number", "label_pattern": "CSD.*NUMBER|MAAA|SUPPLIER.*NUMBER", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "csd_number"},
    {"field_id": "company_name", "field_name": "Company/Business Name", "label_pattern": "COMPANY.*NAME|BUSINESS.*NAME|SUPPLIER.*NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "trading_name", "field_name": "Trading Name", "label_pattern": "TRADING.*NAME|TRADE.*AS", "page": 1, "position_normalized": {"x": 0.1, "y": 0.25, "width": 0.8, "height": 0.03}, "data_type": "text", "is_required": false, "profile_mapping": "trading_name"},
    {"field_id": "registration_number", "field_name": "Registration Number", "label_pattern": "REGISTRATION.*NUMBER|CIPC.*NUMBER|REG.*NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.3, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "registration_number"},
    {"field_id": "tax_number", "field_name": "Tax Number", "label_pattern": "TAX.*NUMBER|INCOME.*TAX|TAX.*REFERENCE", "page": 1, "position_normalized": {"x": 0.5, "y": 0.3, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "tax_number"},
    {"field_id": "vat_number", "field_name": "VAT Number", "label_pattern": "VAT.*NUMBER|VAT.*REG", "page": 1, "position_normalized": {"x": 0.1, "y": 0.35, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": false, "profile_mapping": "vat_number"},
    {"field_id": "bbbee_level", "field_name": "B-BBEE Level", "label_pattern": "B-BBEE.*LEVEL|BEE.*LEVEL|BBBEE.*STATUS", "page": 1, "position_normalized": {"x": 0.5, "y": 0.35, "width": 0.2, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": "bbbee_level"}
  ]'::jsonb,
  1, 'Central Supplier Database registration/verification form', '2023',
  true, true, 'system'
);

-- Generic Tender Cover Page
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Generic Tender Cover Page', 'COVER', 'SA Government Tender', 'General',
  'cover_structure_v1', 'cover_layout_v1', 0.65,
  '[
    {"field_id": "tender_number", "field_name": "Tender Number", "label_pattern": "TENDER.*NUMBER|BID.*NUMBER|CONTRACT.*NO|REFERENCE.*NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "tender_title", "field_name": "Tender Title/Description", "label_pattern": "TENDER.*TITLE|DESCRIPTION|SUBJECT", "page": 1, "position_normalized": {"x": 0.1, "y": 0.3, "width": 0.8, "height": 0.06}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "closing_date", "field_name": "Closing Date", "label_pattern": "CLOSING.*DATE|SUBMISSION.*DATE|DUE.*DATE", "page": 1, "position_normalized": {"x": 0.1, "y": 0.5, "width": 0.3, "height": 0.03}, "data_type": "date", "is_required": true, "profile_mapping": null},
    {"field_id": "closing_time", "field_name": "Closing Time", "label_pattern": "CLOSING.*TIME|TIME", "page": 1, "position_normalized": {"x": 0.5, "y": 0.5, "width": 0.2, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "department", "field_name": "Department/Municipality", "label_pattern": "DEPARTMENT|MUNICIPALITY|ORGAN.*STATE|INSTITUTION", "page": 1, "position_normalized": {"x": 0.1, "y": 0.1, "width": 0.8, "height": 0.03}, "data_type": "text", "is_required": false, "profile_mapping": null}
  ]'::jsonb,
  1, 'Generic tender document cover page template', '2023',
  true, true, 'system'
);

-- Bill of Quantities Template
INSERT INTO documind_templates (
  name, code, category, subcategory,
  fingerprint_structure, fingerprint_layout, match_threshold,
  field_mappings, page_count, description, version,
  is_system, is_public, created_by
) VALUES (
  'Bill of Quantities', 'BOQ', 'SA Government Tender', 'Pricing',
  'boq_structure_v1', 'boq_layout_v1', 0.70,
  '[
    {"field_id": "project_name", "field_name": "Project Name", "label_pattern": "PROJECT.*NAME|PROJECT.*TITLE|CONTRACT.*NAME", "page": 1, "position_normalized": {"x": 0.1, "y": 0.1, "width": 0.8, "height": 0.03}, "data_type": "text", "is_required": false, "profile_mapping": null},
    {"field_id": "tender_number", "field_name": "Tender Number", "label_pattern": "TENDER.*NO|BID.*NO|CONTRACT.*NO", "page": 1, "position_normalized": {"x": 0.1, "y": 0.15, "width": 0.4, "height": 0.03}, "data_type": "text", "is_required": true, "profile_mapping": null},
    {"field_id": "bidder_name", "field_name": "Bidder Name", "label_pattern": "BIDDER.*NAME|CONTRACTOR.*NAME|COMPANY", "page": 1, "position_normalized": {"x": 0.1, "y": 0.2, "width": 0.8, "height": 0.03}, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
    {"field_id": "subtotal", "field_name": "Subtotal", "label_pattern": "SUB.*TOTAL|SUBTOTAL|TOTAL.*EXCL", "page": 1, "position_normalized": {"x": 0.7, "y": 0.85, "width": 0.2, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null},
    {"field_id": "vat", "field_name": "VAT", "label_pattern": "VAT|VALUE.*ADDED.*TAX", "page": 1, "position_normalized": {"x": 0.7, "y": 0.88, "width": 0.2, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null},
    {"field_id": "total", "field_name": "Total", "label_pattern": "GRAND.*TOTAL|TOTAL.*INCL|TOTAL", "page": 1, "position_normalized": {"x": 0.7, "y": 0.91, "width": 0.2, "height": 0.03}, "data_type": "currency", "is_required": true, "profile_mapping": null}
  ]'::jsonb,
  null, 'Bill of Quantities pricing document template', '2023',
  true, true, 'system'
);
