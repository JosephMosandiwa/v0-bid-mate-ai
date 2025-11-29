-- ============================================
-- ADDITIONAL SA TENDER TEMPLATES
-- Version 1.0.1
-- ============================================

-- SBD2 - Tax Clearance Certificate
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Tax Clearance Certificate Requirement', 'SBD2', 'SA Government Tender', 'Standard Bidding Document', 'sbd2_structure_v1', 'sbd2_layout_v1', 0.70, 
'[{"field_id": "taxpayer_name", "field_name": "Taxpayer Name", "label_pattern": "TAXPAYER.*NAME|NAME OF TAXPAYER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "tax_reference", "field_name": "Tax Reference Number", "label_pattern": "TAX REFERENCE|TAX.*NUMBER|INCOME TAX", "page": 1, "data_type": "text", "is_required": true, "profile_mapping": "tax_number"},
{"field_id": "tax_status", "field_name": "Tax Compliance Status", "label_pattern": "TAX COMPLIANCE|TAX STATUS|COMPLIANT", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
1, 'Standard Bidding Document 2 - Tax Clearance Certificate requirement', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- SBD3.2 - Pricing Schedule (Non-Firm Prices)
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Pricing Schedule - Non-Firm Prices', 'SBD3.2', 'SA Government Tender', 'Standard Bidding Document', 'sbd3_2_structure_v1', 'sbd3_2_layout_v1', 0.75, 
'[{"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "contract_period", "field_name": "Contract Period", "label_pattern": "CONTRACT PERIOD|PERIOD", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "price_adjustment_formula", "field_name": "Price Adjustment Formula", "label_pattern": "PRICE ADJUSTMENT|ADJUSTMENT FORMULA|ESCALATION", "page": 1, "data_type": "text", "is_required": false}]'::jsonb, 
1, 'Standard Bidding Document 3.2 - Pricing Schedule for non-firm prices with escalation', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- SBD3.3 - Pricing Schedule (Professional Services)
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Pricing Schedule - Professional Services', 'SBD3.3', 'SA Government Tender', 'Standard Bidding Document', 'sbd3_3_structure_v1', 'sbd3_3_layout_v1', 0.75, 
'[{"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER|SERVICE PROVIDER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "hourly_rate", "field_name": "Hourly Rate", "label_pattern": "HOURLY RATE|RATE PER HOUR|DAILY RATE", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "professional_fees", "field_name": "Professional Fees", "label_pattern": "PROFESSIONAL FEES|CONSULTING FEES|FEES", "page": 1, "data_type": "currency", "is_required": true}]'::jsonb, 
1, 'Standard Bidding Document 3.3 - Pricing Schedule for professional services', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- SBD5 - National Industrial Participation
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('National Industrial Participation Programme', 'SBD5', 'SA Government Tender', 'Standard Bidding Document', 'sbd5_structure_v1', 'sbd5_layout_v1', 0.70, 
'[{"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "imported_content", "field_name": "Imported Content", "label_pattern": "IMPORTED CONTENT|IMPORT VALUE", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "nip_obligation", "field_name": "NIP Obligation", "label_pattern": "NIP OBLIGATION|INDUSTRIAL PARTICIPATION", "page": 1, "data_type": "currency", "is_required": true}]'::jsonb, 
2, 'Standard Bidding Document 5 - National Industrial Participation Programme', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- SBD6.2 - Local Production and Content
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Local Production and Content', 'SBD6.2', 'SA Government Tender', 'Standard Bidding Document', 'sbd6_2_structure_v1', 'sbd6_2_layout_v1', 0.70, 
'[{"field_id": "bidder_name", "field_name": "Name of Bidder", "label_pattern": "NAME OF BIDDER|BIDDER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "local_content_percentage", "field_name": "Local Content Percentage", "label_pattern": "LOCAL CONTENT|LOCAL PRODUCTION|PERCENTAGE", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "stipulated_minimum", "field_name": "Stipulated Minimum Content", "label_pattern": "STIPULATED MINIMUM|MINIMUM.*CONTENT|DESIGNATED.*SECTOR", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
2, 'Standard Bidding Document 6.2 - Local Production and Content for designated sectors', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- SBD7.1 - Contract Form (Goods)
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Contract Form - Purchase of Goods', 'SBD7.1', 'SA Government Tender', 'Standard Bidding Document', 'sbd7_1_structure_v1', 'sbd7_1_layout_v1', 0.70, 
'[{"field_id": "supplier_name", "field_name": "Supplier Name", "label_pattern": "SUPPLIER|CONTRACTOR|SELLER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "purchaser", "field_name": "Purchaser", "label_pattern": "PURCHASER|BUYER|DEPARTMENT", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "contract_value", "field_name": "Contract Value", "label_pattern": "CONTRACT VALUE|CONTRACT PRICE|TOTAL", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "delivery_period", "field_name": "Delivery Period", "label_pattern": "DELIVERY PERIOD|DELIVERY DATE|LEAD TIME", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
3, 'Standard Bidding Document 7.1 - Contract Form for purchase of goods', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- SBD7.2 - Contract Form (Services)
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Contract Form - Rendering of Services', 'SBD7.2', 'SA Government Tender', 'Standard Bidding Document', 'sbd7_2_structure_v1', 'sbd7_2_layout_v1', 0.70, 
'[{"field_id": "service_provider", "field_name": "Service Provider", "label_pattern": "SERVICE PROVIDER|CONTRACTOR|CONSULTANT", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "employer", "field_name": "Employer", "label_pattern": "EMPLOYER|CLIENT|DEPARTMENT", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "contract_value", "field_name": "Contract Value", "label_pattern": "CONTRACT VALUE|CONTRACT PRICE|TOTAL", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "contract_period", "field_name": "Contract Period", "label_pattern": "CONTRACT PERIOD|DURATION|SERVICE PERIOD", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
3, 'Standard Bidding Document 7.2 - Contract Form for rendering of services', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- GCC - General Conditions of Contract
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('General Conditions of Contract', 'GCC', 'SA Government Tender', 'Contract', 'gcc_structure_v1', 'gcc_layout_v1', 0.65, 
'[{"field_id": "contract_number", "field_name": "Contract Number", "label_pattern": "CONTRACT NO|CONTRACT NUMBER|AGREEMENT NO", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "effective_date", "field_name": "Effective Date", "label_pattern": "EFFECTIVE DATE|COMMENCEMENT|START DATE", "page": 1, "data_type": "date", "is_required": true},
{"field_id": "completion_date", "field_name": "Completion Date", "label_pattern": "COMPLETION DATE|END DATE|EXPIRY", "page": 1, "data_type": "date", "is_required": true}]'::jsonb, 
NULL, 'General Conditions of Contract for government tenders', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- CIDB - Construction Industry Development Board Forms
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('CIDB Registration Certificate', 'CIDB', 'SA Government Tender', 'Construction', 'cidb_structure_v1', 'cidb_layout_v1', 0.65, 
'[{"field_id": "contractor_name", "field_name": "Contractor Name", "label_pattern": "CONTRACTOR NAME|REGISTERED NAME|COMPANY", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "cidb_number", "field_name": "CIDB Registration Number", "label_pattern": "CIDB.*NUMBER|REGISTRATION.*NUMBER|CRS NUMBER", "page": 1, "data_type": "text", "is_required": true, "profile_mapping": "cidb_number"},
{"field_id": "grading", "field_name": "CIDB Grading", "label_pattern": "GRADING|GRADE|DESIGNATION", "page": 1, "data_type": "text", "is_required": true, "profile_mapping": "cidb_grading"},
{"field_id": "category", "field_name": "Category of Work", "label_pattern": "CATEGORY|CLASS OF WORK|WORKS CATEGORY", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
1, 'CIDB Registration Certificate for construction contractors', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- COIDA - Compensation for Occupational Injuries
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Letter of Good Standing (COIDA)', 'COIDA', 'SA Government Tender', 'Compliance', 'coida_structure_v1', 'coida_layout_v1', 0.65, 
'[{"field_id": "employer_name", "field_name": "Employer Name", "label_pattern": "EMPLOYER|COMPANY NAME|ENTITY", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "registration_number", "field_name": "Registration Number", "label_pattern": "REGISTRATION NUMBER|REG.*NO|EMPLOYER.*NUMBER", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "valid_until", "field_name": "Valid Until", "label_pattern": "VALID UNTIL|EXPIRY|EXPIRES", "page": 1, "data_type": "date", "is_required": true}]'::jsonb, 
1, 'Compensation for Occupational Injuries and Diseases Letter of Good Standing', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- UIF - Unemployment Insurance Fund
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('UIF Compliance Certificate', 'UIF', 'SA Government Tender', 'Compliance', 'uif_structure_v1', 'uif_layout_v1', 0.65, 
'[{"field_id": "employer_name", "field_name": "Employer Name", "label_pattern": "EMPLOYER|COMPANY|BUSINESS NAME", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "uif_reference", "field_name": "UIF Reference Number", "label_pattern": "UIF.*REFERENCE|UIF.*NUMBER|REFERENCE", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "compliance_status", "field_name": "Compliance Status", "label_pattern": "COMPLIANCE STATUS|STATUS|COMPLIANT", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
1, 'UIF Unemployment Insurance Fund Compliance Certificate', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Tender Specification Document
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Tender Specification Document', 'SPEC', 'SA Government Tender', 'Specification', 'spec_structure_v1', 'spec_layout_v1', 0.60, 
'[{"field_id": "tender_number", "field_name": "Tender Number", "label_pattern": "TENDER.*NO|BID.*NO|CONTRACT.*NO|REFERENCE", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "tender_description", "field_name": "Tender Description", "label_pattern": "DESCRIPTION|SCOPE|PROJECT NAME|TENDER FOR", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "closing_date", "field_name": "Closing Date", "label_pattern": "CLOSING DATE|SUBMISSION DATE|DUE DATE|DEADLINE", "page": 1, "data_type": "date", "is_required": true},
{"field_id": "briefing_session", "field_name": "Briefing Session", "label_pattern": "BRIEFING|SITE MEETING|COMPULSORY MEETING|SITE VISIT", "page": 1, "data_type": "datetime", "is_required": false}]'::jsonb, 
NULL, 'General tender specification document template', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Bank Guarantee / Performance Bond
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Bank Guarantee / Performance Bond', 'GUARANTEE', 'SA Government Tender', 'Financial', 'guarantee_structure_v1', 'guarantee_layout_v1', 0.65, 
'[{"field_id": "principal", "field_name": "Principal/Contractor", "label_pattern": "PRINCIPAL|CONTRACTOR|SUPPLIER", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "beneficiary", "field_name": "Beneficiary", "label_pattern": "BENEFICIARY|EMPLOYER|CLIENT", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "guarantee_amount", "field_name": "Guarantee Amount", "label_pattern": "GUARANTEE AMOUNT|AMOUNT|SUM OF|VALUE", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "expiry_date", "field_name": "Expiry Date", "label_pattern": "EXPIRY DATE|VALID UNTIL|EXPIRES", "page": 1, "data_type": "date", "is_required": true}]'::jsonb, 
1, 'Bank Guarantee or Performance Bond document', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Power of Attorney
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Power of Attorney', 'POA', 'SA Government Tender', 'Legal', 'poa_structure_v1', 'poa_layout_v1', 0.65, 
'[{"field_id": "company_name", "field_name": "Company Name", "label_pattern": "COMPANY|PRINCIPAL|GRANTOR", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "authorized_person", "field_name": "Authorized Person", "label_pattern": "AUTHORIZED|AUTHORISED|ATTORNEY|AGENT|REPRESENTATIVE", "page": 1, "data_type": "name", "is_required": true},
{"field_id": "id_number", "field_name": "ID Number", "label_pattern": "ID NUMBER|IDENTITY|RSA ID", "page": 1, "data_type": "id_number", "is_required": true},
{"field_id": "signing_authority", "field_name": "Signing Authority", "label_pattern": "SIGN.*ON BEHALF|AUTHORITY TO|EMPOWERED TO", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
1, 'Power of Attorney for signing on behalf of company', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Company Resolution
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Company Resolution', 'RESOLUTION', 'SA Government Tender', 'Legal', 'resolution_structure_v1', 'resolution_layout_v1', 0.65, 
'[{"field_id": "company_name", "field_name": "Company Name", "label_pattern": "COMPANY|CORPORATION|ENTITY", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "registration_number", "field_name": "Registration Number", "label_pattern": "REGISTRATION NUMBER|REG.*NO|CIPC", "page": 1, "data_type": "text", "is_required": true, "profile_mapping": "registration_number"},
{"field_id": "resolution_date", "field_name": "Resolution Date", "label_pattern": "DATE.*RESOLUTION|RESOLVED ON|DATED", "page": 1, "data_type": "date", "is_required": true},
{"field_id": "authorized_signatory", "field_name": "Authorized Signatory", "label_pattern": "AUTHORIZED|AUTHORISED|SIGNATORY|DIRECTOR", "page": 1, "data_type": "name", "is_required": true}]'::jsonb, 
1, 'Company Resolution authorizing tender participation', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Joint Venture Agreement
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Joint Venture Agreement', 'JV', 'SA Government Tender', 'Legal', 'jv_structure_v1', 'jv_layout_v1', 0.65, 
'[{"field_id": "jv_name", "field_name": "JV Name", "label_pattern": "JOINT VENTURE|JV NAME|CONSORTIUM", "page": 1, "data_type": "company", "is_required": true},
{"field_id": "lead_partner", "field_name": "Lead Partner", "label_pattern": "LEAD PARTNER|LEAD MEMBER|PRINCIPAL PARTNER", "page": 1, "data_type": "company", "is_required": true},
{"field_id": "partner_shares", "field_name": "Partner Shares", "label_pattern": "SHARE|PERCENTAGE|PARTICIPATION", "page": 1, "data_type": "text", "is_required": true}]'::jsonb, 
NULL, 'Joint Venture Agreement for consortium bids', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Professional Indemnity Insurance
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Professional Indemnity Insurance', 'PI_INSURANCE', 'SA Government Tender', 'Insurance', 'pi_structure_v1', 'pi_layout_v1', 0.65, 
'[{"field_id": "insured_name", "field_name": "Insured Name", "label_pattern": "INSURED|POLICY HOLDER|COVERED PARTY", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "policy_number", "field_name": "Policy Number", "label_pattern": "POLICY NUMBER|POLICY NO|CERTIFICATE NO", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "cover_amount", "field_name": "Cover Amount", "label_pattern": "COVER|LIMIT|INDEMNITY.*AMOUNT|SUM INSURED", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "expiry_date", "field_name": "Expiry Date", "label_pattern": "EXPIRY|VALID UNTIL|PERIOD.*TO", "page": 1, "data_type": "date", "is_required": true}]'::jsonb, 
1, 'Professional Indemnity Insurance Certificate', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Public Liability Insurance
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Public Liability Insurance', 'PL_INSURANCE', 'SA Government Tender', 'Insurance', 'pl_structure_v1', 'pl_layout_v1', 0.65, 
'[{"field_id": "insured_name", "field_name": "Insured Name", "label_pattern": "INSURED|POLICY HOLDER|COVERED PARTY", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "policy_number", "field_name": "Policy Number", "label_pattern": "POLICY NUMBER|POLICY NO|CERTIFICATE NO", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "cover_amount", "field_name": "Cover Amount", "label_pattern": "COVER|LIMIT|LIABILITY.*AMOUNT|SUM INSURED", "page": 1, "data_type": "currency", "is_required": true},
{"field_id": "expiry_date", "field_name": "Expiry Date", "label_pattern": "EXPIRY|VALID UNTIL|PERIOD.*TO", "page": 1, "data_type": "date", "is_required": true}]'::jsonb, 
1, 'Public Liability Insurance Certificate', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Returnable Schedule
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Returnable Schedule', 'RETURNABLE', 'SA Government Tender', 'Submission', 'returnable_structure_v1', 'returnable_layout_v1', 0.60, 
'[{"field_id": "tender_number", "field_name": "Tender Number", "label_pattern": "TENDER.*NO|BID.*NO|REFERENCE", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "bidder_name", "field_name": "Bidder Name", "label_pattern": "BIDDER|COMPANY|CONTRACTOR", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"}]'::jsonb, 
NULL, 'Returnable Schedule checklist for tender submissions', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;

-- Experience/Track Record
INSERT INTO documind_templates (name, code, category, subcategory, fingerprint_structure, fingerprint_layout, match_threshold, field_mappings, page_count, description, version, is_system, is_public, created_by) 
VALUES ('Experience and Track Record', 'EXPERIENCE', 'SA Government Tender', 'Qualification', 'experience_structure_v1', 'experience_layout_v1', 0.60, 
'[{"field_id": "company_name", "field_name": "Company Name", "label_pattern": "COMPANY|BIDDER|CONTRACTOR", "page": 1, "data_type": "company", "is_required": true, "profile_mapping": "company_name"},
{"field_id": "project_name", "field_name": "Project Name", "label_pattern": "PROJECT NAME|CONTRACT NAME|WORK DESCRIPTION", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "client_name", "field_name": "Client Name", "label_pattern": "CLIENT|EMPLOYER|CUSTOMER", "page": 1, "data_type": "text", "is_required": true},
{"field_id": "contract_value", "field_name": "Contract Value", "label_pattern": "CONTRACT VALUE|VALUE|AMOUNT", "page": 1, "data_type": "currency", "is_required": true}]'::jsonb, 
NULL, 'Experience and Track Record schedule for tenders', '2023', true, true, 'system')
ON CONFLICT DO NOTHING;
