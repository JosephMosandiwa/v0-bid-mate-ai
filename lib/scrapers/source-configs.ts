/**
 * South African Tender Source Configurations
 * 
 * This file contains detailed knowledge about each tender source:
 * - How they structure their tender listings
 * - What fields are available and where to find them
 * - Document download patterns
 * - API endpoints (where available)
 * - HTML selectors for web scraping
 */

export interface SourceFieldMapping {
  /** CSS selector or JSON path to the field */
  selector: string
  /** Type of extraction: 'text', 'attr', 'html', 'json' */
  extractType: 'text' | 'attr' | 'html' | 'json'
  /** Attribute name if extractType is 'attr' */
  attribute?: string
  /** Post-processing function name */
  transform?: 'date' | 'currency' | 'trim' | 'url' | 'phone' | 'email'
  /** Fallback selectors */
  fallbacks?: string[]
}

export interface DocumentPattern {
  /** How documents are listed */
  listSelector: string
  /** How to extract document URL */
  urlSelector: string
  /** How to extract document title */
  titleSelector: string
  /** URL pattern for direct document links */
  urlPattern?: RegExp
  /** Base URL for relative links */
  baseUrl: string
  /** Document formats expected */
  expectedFormats: string[]
}

export interface SourceConfig {
  id: string
  name: string
  type: 'api' | 'html' | 'hybrid'
  
  /** Source details */
  website: string
  description: string
  province?: string
  level: 'national' | 'provincial' | 'municipal' | 'private'
  
  /** API Configuration (if type is 'api' or 'hybrid') */
  api?: {
    baseUrl: string
    endpoints: {
      list: string
      detail?: string
      documents?: string
    }
    authentication?: {
      type: 'none' | 'apiKey' | 'bearer' | 'basic'
      headerName?: string
    }
    pagination: {
      type: 'page' | 'offset' | 'cursor'
      pageParam: string
      sizeParam: string
      defaultSize: number
    }
    dateFormat: string
    responseFormat: 'json' | 'xml'
    /** JSON path to tender array in response */
    tendersPath: string
  }
  
  /** HTML Scraping Configuration (if type is 'html' or 'hybrid') */
  html?: {
    /** URL to scrape */
    listUrl: string
    /** Selector for tender container/row */
    tenderSelector: string
    /** Link to individual tender page */
    detailLinkSelector?: string
    /** Field mappings */
    fields: {
      title: SourceFieldMapping
      reference?: SourceFieldMapping
      organization?: SourceFieldMapping
      description?: SourceFieldMapping
      category?: SourceFieldMapping
      publishDate?: SourceFieldMapping
      closeDate?: SourceFieldMapping
      value?: SourceFieldMapping
      contactPerson?: SourceFieldMapping
      contactEmail?: SourceFieldMapping
      contactPhone?: SourceFieldMapping
      location?: SourceFieldMapping
      province?: SourceFieldMapping
      status?: SourceFieldMapping
    }
  }
  
  /** Document extraction patterns */
  documents: DocumentPattern
  
  /** Special handling flags */
  flags?: {
    requiresJavaScript?: boolean
    requiresLogin?: boolean
    hasAntiScraping?: boolean
    rateLimit?: number // requests per minute
  }
}

/**
 * eTender Portal (National Treasury)
 * Primary source for national government tenders
 * Uses OCDS API format
 */
export const ETENDER_CONFIG: SourceConfig = {
  id: 'etender',
  name: 'eTender Portal (National Treasury)',
  type: 'api',
  website: 'https://etenders.gov.za',
  description: 'Official South African National Treasury eTender portal. Uses OCDS (Open Contracting Data Standard) API.',
  level: 'national',
  
  api: {
    baseUrl: 'https://ocds-api.etenders.gov.za/api',
    endpoints: {
      list: '/OCDSReleases',
      detail: '/OCDSRelease/{ocid}',
      documents: '/OCDSRelease/{ocid}/documents'
    },
    authentication: { type: 'none' },
    pagination: {
      type: 'page',
      pageParam: 'PageNumber',
      sizeParam: 'PageSize',
      defaultSize: 100
    },
    dateFormat: 'ISO8601',
    responseFormat: 'json',
    tendersPath: 'releases'
  },
  
  documents: {
    listSelector: 'tender.documents',
    urlSelector: 'url',
    titleSelector: 'title',
    baseUrl: 'https://etenders.gov.za',
    expectedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip']
  }
}

/**
 * CIDB (Construction Industry Development Board)
 * Specialized for construction tenders
 */
export const CIDB_CONFIG: SourceConfig = {
  id: 'cidb',
  name: 'CIDB Register of Projects',
  type: 'html',
  website: 'https://www.cidb.org.za',
  description: 'Construction Industry Development Board - Lists construction-related government tenders with CIDB grading requirements.',
  level: 'national',
  
  html: {
    listUrl: 'https://www.cidb.org.za/rop',
    tenderSelector: 'table.rop-table tbody tr, div.tender-card',
    detailLinkSelector: 'a.tender-link, td:first-child a',
    fields: {
      title: {
        selector: 'td.tender-title, .tender-name, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: 'td.tender-ref, .reference, td:nth-child(1)',
        extractType: 'text',
        transform: 'trim'
      },
      organization: {
        selector: 'td.employer, .client-name, td:nth-child(3)',
        extractType: 'text',
        transform: 'trim'
      },
      category: {
        selector: 'td.category, .work-category',
        extractType: 'text',
        fallbacks: ['td:nth-child(4)']
      },
      closeDate: {
        selector: 'td.closing-date, .close-date, td:nth-child(5)',
        extractType: 'text',
        transform: 'date'
      },
      value: {
        selector: 'td.value, .tender-value, td:nth-child(6)',
        extractType: 'text',
        transform: 'currency'
      },
      province: {
        selector: 'td.province, .location-province',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: 'div.documents-list a, table.documents tr a',
    urlSelector: 'href',
    titleSelector: 'text()',
    urlPattern: /\.(pdf|doc|docx|xls|xlsx)$/i,
    baseUrl: 'https://www.cidb.org.za',
    expectedFormats: ['pdf', 'doc', 'docx']
  },
  
  flags: {
    requiresJavaScript: false,
    rateLimit: 30
  }
}

/**
 * Government Technical Advisory Centre (GTAC)
 */
export const GTAC_CONFIG: SourceConfig = {
  id: 'gtac',
  name: 'GTAC (Government Technical Advisory Centre)',
  type: 'html',
  website: 'https://www.gtac.gov.za',
  description: 'Government Technical Advisory Centre tenders for consulting and advisory services.',
  level: 'national',
  
  html: {
    listUrl: 'https://www.gtac.gov.za/tenders',
    tenderSelector: 'article.tender, div.tender-item, table.tenders tbody tr',
    detailLinkSelector: 'a.read-more, h3 a',
    fields: {
      title: {
        selector: 'h3, .tender-title, td:nth-child(1)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-reference, .ref-number',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, .deadline, td:nth-child(3)',
        extractType: 'text',
        transform: 'date'
      },
      description: {
        selector: '.tender-description, .excerpt, p',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: '.tender-documents a, .attachments a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.gtac.gov.za',
    expectedFormats: ['pdf', 'doc', 'docx']
  }
}

/**
 * Gauteng Province eTenders
 */
export const GAUTENG_CONFIG: SourceConfig = {
  id: 'gauteng',
  name: 'Gauteng Provincial Treasury',
  type: 'html',
  website: 'https://www.gauteng.gov.za',
  description: 'Gauteng Provincial Government tender portal.',
  province: 'Gauteng',
  level: 'provincial',
  
  html: {
    listUrl: 'https://www.gauteng.gov.za/tenders',
    tenderSelector: 'div.tender-listing, table.tenders tr',
    fields: {
      title: {
        selector: '.tender-title, h4, td:first-child',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-number, .ref',
        extractType: 'text'
      },
      organization: {
        selector: '.department, .org-name',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, .deadline',
        extractType: 'text',
        transform: 'date'
      },
      value: {
        selector: '.tender-value, .amount',
        extractType: 'text',
        transform: 'currency'
      }
    }
  },
  
  documents: {
    listSelector: '.document-links a, .attachments a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.gauteng.gov.za',
    expectedFormats: ['pdf', 'doc', 'docx', 'zip']
  }
}

/**
 * Western Cape Province
 */
export const WESTERN_CAPE_CONFIG: SourceConfig = {
  id: 'western_cape',
  name: 'Western Cape Government',
  type: 'html',
  website: 'https://www.westerncape.gov.za',
  description: 'Western Cape Provincial Government tenders and quotations.',
  province: 'Western Cape',
  level: 'provincial',
  
  html: {
    listUrl: 'https://www.westerncape.gov.za/tenders',
    tenderSelector: 'article.tender, .tender-row, table.tenders tbody tr',
    fields: {
      title: {
        selector: 'h3.tender-title, .title, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-ref, td:nth-child(1)',
        extractType: 'text'
      },
      organization: {
        selector: '.department-name, td:nth-child(3)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.close-date, td:nth-child(4)',
        extractType: 'text',
        transform: 'date'
      },
      category: {
        selector: '.category, .tender-type',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: '.tender-documents a, .downloads a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.westerncape.gov.za',
    expectedFormats: ['pdf', 'doc', 'docx']
  }
}

/**
 * KwaZulu-Natal Province
 */
export const KZN_CONFIG: SourceConfig = {
  id: 'kzn',
  name: 'KwaZulu-Natal Provincial Treasury',
  type: 'html',
  website: 'https://www.kznonline.gov.za',
  description: 'KwaZulu-Natal Provincial Treasury tender bulletin.',
  province: 'KwaZulu-Natal',
  level: 'provincial',
  
  html: {
    listUrl: 'https://www.kznonline.gov.za/tenders',
    tenderSelector: '.tender-item, table.tenders tbody tr',
    fields: {
      title: {
        selector: '.tender-title, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.bid-number, td:nth-child(1)',
        extractType: 'text'
      },
      organization: {
        selector: '.department, td:nth-child(3)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, td:nth-child(4)',
        extractType: 'text',
        transform: 'date'
      }
    }
  },
  
  documents: {
    listSelector: '.document-list a, .downloads a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.kznonline.gov.za',
    expectedFormats: ['pdf', 'doc']
  }
}

/**
 * City of Cape Town Metropolitan Municipality
 */
export const CAPE_TOWN_CONFIG: SourceConfig = {
  id: 'cape_town',
  name: 'City of Cape Town',
  type: 'html',
  website: 'https://www.capetown.gov.za',
  description: 'City of Cape Town Supply Chain Management - tenders and quotations.',
  province: 'Western Cape',
  level: 'municipal',
  
  html: {
    listUrl: 'https://www.capetown.gov.za/work%20and%20business/advertised-tenders',
    tenderSelector: 'article.tender, .tender-listing, table tbody tr',
    fields: {
      title: {
        selector: '.tender-title, h4, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.bid-number, .tender-ref, td:nth-child(1)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, .deadline, td:nth-child(3)',
        extractType: 'text',
        transform: 'date'
      },
      category: {
        selector: '.commodity, .category',
        extractType: 'text'
      },
      contactPerson: {
        selector: '.contact-person, .enquiries',
        extractType: 'text'
      },
      contactEmail: {
        selector: '.contact-email, a[href^="mailto:"]',
        extractType: 'text',
        transform: 'email'
      }
    }
  },
  
  documents: {
    listSelector: '.tender-documents a, .bid-documents a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.capetown.gov.za',
    expectedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
  }
}

/**
 * City of Johannesburg Metropolitan Municipality
 */
export const JOHANNESBURG_CONFIG: SourceConfig = {
  id: 'johannesburg',
  name: 'City of Johannesburg',
  type: 'html',
  website: 'https://www.joburg.org.za',
  description: 'City of Johannesburg Metropolitan Municipality tenders.',
  province: 'Gauteng',
  level: 'municipal',
  
  html: {
    listUrl: 'https://www.joburg.org.za/work_/Pages/Tenders/Current-Tenders.aspx',
    tenderSelector: '.tender-item, table.tenders tbody tr, .ms-listviewtable tr',
    fields: {
      title: {
        selector: '.tender-description, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-number, td:nth-child(1)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, td:nth-child(3)',
        extractType: 'text',
        transform: 'date'
      },
      category: {
        selector: '.category, .type',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: '.attachments a, td a[href*=".pdf"]',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.joburg.org.za',
    expectedFormats: ['pdf', 'doc', 'docx']
  }
}

/**
 * eThekwini Metropolitan Municipality (Durban)
 */
export const ETHEKWINI_CONFIG: SourceConfig = {
  id: 'ethekwini',
  name: 'eThekwini Municipality',
  type: 'html',
  website: 'https://www.durban.gov.za',
  description: 'eThekwini Metropolitan Municipality (Durban) tenders.',
  province: 'KwaZulu-Natal',
  level: 'municipal',
  
  html: {
    listUrl: 'https://www.durban.gov.za/tenders',
    tenderSelector: '.tender-listing, table.tenders tbody tr',
    fields: {
      title: {
        selector: '.tender-title, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-ref, td:nth-child(1)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, td:nth-child(3)',
        extractType: 'text',
        transform: 'date'
      },
      organization: {
        selector: '.department, td:nth-child(4)',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: '.tender-documents a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.durban.gov.za',
    expectedFormats: ['pdf', 'doc']
  }
}

/**
 * Eskom (State-Owned Enterprise)
 */
export const ESKOM_CONFIG: SourceConfig = {
  id: 'eskom',
  name: 'Eskom Holdings',
  type: 'html',
  website: 'https://www.eskom.co.za',
  description: 'Eskom Holdings SOC Ltd - electricity utility tenders.',
  level: 'national',
  
  html: {
    listUrl: 'https://www.eskom.co.za/tenders',
    tenderSelector: 'article.tender, .tender-card, table.tenders tbody tr',
    fields: {
      title: {
        selector: '.tender-title, h4, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-number, .ref, td:nth-child(1)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, td:nth-child(3)',
        extractType: 'text',
        transform: 'date'
      },
      category: {
        selector: '.commodity-group, .category',
        extractType: 'text'
      },
      contactEmail: {
        selector: '.contact-email, a[href^="mailto:"]',
        extractType: 'attr',
        attribute: 'href',
        transform: 'email'
      }
    }
  },
  
  documents: {
    listSelector: '.tender-documents a, .downloads a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.eskom.co.za',
    expectedFormats: ['pdf', 'doc', 'docx', 'zip']
  }
}

/**
 * Transnet (State-Owned Enterprise)
 */
export const TRANSNET_CONFIG: SourceConfig = {
  id: 'transnet',
  name: 'Transnet SOC Ltd',
  type: 'html',
  website: 'https://www.transnet.net',
  description: 'Transnet freight logistics and rail transport tenders.',
  level: 'national',
  
  html: {
    listUrl: 'https://www.transnet.net/TenderPortal/Pages/Tenders.aspx',
    tenderSelector: '.tender-item, table tbody tr',
    fields: {
      title: {
        selector: '.tender-description, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-number, td:nth-child(1)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, td:nth-child(4)',
        extractType: 'text',
        transform: 'date'
      },
      category: {
        selector: '.commodity, td:nth-child(3)',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: '.tender-documents a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.transnet.net',
    expectedFormats: ['pdf', 'doc', 'docx']
  }
}

/**
 * SANRAL (South African National Roads Agency)
 */
export const SANRAL_CONFIG: SourceConfig = {
  id: 'sanral',
  name: 'SANRAL',
  type: 'html',
  website: 'https://www.nra.co.za',
  description: 'South African National Roads Agency Limited - road infrastructure tenders.',
  level: 'national',
  
  html: {
    listUrl: 'https://www.nra.co.za/tenders',
    tenderSelector: '.tender-item, article.tender, table tbody tr',
    fields: {
      title: {
        selector: '.tender-title, h3, td:nth-child(2)',
        extractType: 'text',
        transform: 'trim'
      },
      reference: {
        selector: '.tender-ref, .bid-number, td:nth-child(1)',
        extractType: 'text'
      },
      closeDate: {
        selector: '.closing-date, td:nth-child(3)',
        extractType: 'text',
        transform: 'date'
      },
      location: {
        selector: '.location, .region, td:nth-child(4)',
        extractType: 'text'
      }
    }
  },
  
  documents: {
    listSelector: '.document-downloads a, .tender-docs a',
    urlSelector: 'href',
    titleSelector: 'text()',
    baseUrl: 'https://www.nra.co.za',
    expectedFormats: ['pdf', 'doc', 'docx', 'dwg']
  }
}

/**
 * All source configurations indexed by ID
 */
export const SOURCE_CONFIGS: Record<string, SourceConfig> = {
  etender: ETENDER_CONFIG,
  cidb: CIDB_CONFIG,
  gtac: GTAC_CONFIG,
  gauteng: GAUTENG_CONFIG,
  western_cape: WESTERN_CAPE_CONFIG,
  kzn: KZN_CONFIG,
  cape_town: CAPE_TOWN_CONFIG,
  johannesburg: JOHANNESBURG_CONFIG,
  ethekwini: ETHEKWINI_CONFIG,
  eskom: ESKOM_CONFIG,
  transnet: TRANSNET_CONFIG,
  sanral: SANRAL_CONFIG,
}

/**
 * Get source config by scraper_type from tender_sources table
 */
export function getSourceConfig(scraperType: string): SourceConfig | undefined {
  // Map scraper_type to config ID
  const typeToConfigId: Record<string, string> = {
    'etender_api': 'etender',
    'etender': 'etender',
    'cidb': 'cidb',
    'gtac': 'gtac',
    'provincial_gauteng': 'gauteng',
    'provincial_western_cape': 'western_cape',
    'provincial_kzn': 'kzn',
    'municipal_cape_town': 'cape_town',
    'municipal_johannesburg': 'johannesburg',
    'municipal_ethekwini': 'ethekwini',
    'soe_eskom': 'eskom',
    'soe_transnet': 'transnet',
    'soe_sanral': 'sanral',
  }
  
  const configId = typeToConfigId[scraperType] || scraperType
  return SOURCE_CONFIGS[configId]
}

/**
 * Get all available source configurations
 */
export function getAllSourceConfigs(): SourceConfig[] {
  return Object.values(SOURCE_CONFIGS)
}

/**
 * Get source configs by level
 */
export function getSourceConfigsByLevel(level: SourceConfig['level']): SourceConfig[] {
  return Object.values(SOURCE_CONFIGS).filter(c => c.level === level)
}

/**
 * Get source configs by province
 */
export function getSourceConfigsByProvince(province: string): SourceConfig[] {
  return Object.values(SOURCE_CONFIGS).filter(
    c => c.province?.toLowerCase() === province.toLowerCase()
  )
}
