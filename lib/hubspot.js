import { Client } from "@hubspot/api-client";
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
import { BASIC_PRODUCTS } from "./constants";

/**
 * Adds or updates a contact in HubSpot
 * @param {Object} contactData - Contact information
 * @param {string} contactData.email - Primary email (required)
 * @param {string} contactData.firstname 
 * @param {string} contactData.lastname
 * @param {string} contactData.phone
 * @param {string} contactData.city - For service area tracking
 * @param {string} contactData.projectType - 'residential' or 'commercial'
 * @returns {Promise<Object>} HubSpot contact object
 */

export async function addOrUpdateContact(contactData) {
  // 1. Validation - Enhanced for CCTV business needs
  if (!contactData?.email) {
    throw new Error('Email is required for contact operations');
  }

  try {
    // 2. Search with only essential properties to reduce API payload
    const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: contactData.email
        }]
      }],
      properties: ['email'], // Only what's needed for identification
      limit: 1
    });

    const existingContact = searchResponse.results[0];

    // 3. Prepare properties with CCTV-specific defaults
    const properties = {
      email: contactData.email,
      firstname: contactData.name || '',
      lastname: contactData.lastname || '',
      phone: contactData.phone || '',
      city: contactData.city || '',
      // CCTV Custom Properties
      project_type: contactData.type || 'unknown',
      budget: contactData.budget || 'Not specified',
      timeline: contactData.timeline || 'Flexible',
      cctv_features: contactData.features?.join(', ') || 'None',
      // System Properties
      hs_lead_status: 'IN_PROGRESS' // Default status instead of custom
    };

    console.log("properties:", properties);

    // 4. Create or update contact
    let contact;
    if (existingContact) {
      contact = await hubspotClient.crm.contacts.basicApi.update(
        existingContact.id,
        { properties }
      );
      console.log(`Updated contact ${contact.id}`, properties);
    } else {
      contact = await hubspotClient.crm.contacts.basicApi.create({ properties });
      console.log(`Created contact ${contact.id}`, properties);
    }

    // 5. Conditional company association (non-blocking)
    if (contactData.companyName && contactData.projectType === 'commercial') {
      await associateWithCompany(contact.id, contactData.companyName)
        .catch(e => console.warn(`Company association failed: ${e.message}`));
    }

    return contact;

  } catch (error) {
    console.error('HubSpot contact error:', {
      message: error.message,
      contactData: { // Redacted logging
        email: contactData.email,
        projectType: contactData.projectType,
        hasCompany: !!contactData.companyName
      },
      stack: error.stack
    });
    throw new Error(`Contact processing failed: ${error.message}`);
  }
}

export async function associateWithCompany(contactId, companyName) {
  try {
    // Search for existing company
    const companySearch = await hubspotClient.crm.companies.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'name',
          operator: 'EQ',
          value: companyName
        }]
      }],
      limit: 1
    });

    let companyId;
    if (companySearch.results.length > 0) {
      companyId = companySearch.results[0].id;
    } else {
      // Create new company if not found
      const newCompany = await hubspotClient.crm.companies.basicApi.create({
        properties: { name: companyName }
      });
      companyId = newCompany.id;
    }

    // Create association
    await hubspotClient.crm.contacts.associationsApi.create(
      contactId,
      'companies',
      companyId,
      [{
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: 1 // Company to Contact
      }]
    );

  } catch (error) {
    console.error('Company association failed:', error);
    // Fail silently as this isn't critical
  }
}

export async function logHubSpotCall(contactData) {
  console.log("logging HubSpot call data:", contactData);
  try {
    const payload = {
      properties: {
        hs_call_title: 'AI Call - Completed',
        hs_call_body: `AI call summary: ${contactData.callSummary || 'No summary provided'}`,
        hs_timestamp: new Date().toISOString(),
        hs_call_duration: contactData.callDuration?.toString() || '0',
        hs_call_status: 'COMPLETED',
        hs_call_direction: 'OUTBOUND',
        ...(contactData.recordingUrl && { 
          hs_call_recording_url: contactData.recordingUrl 
        })
      },
      associations: []
    };

    if (contactData.contactId) {
      payload.associations.push({
        to: { id: contactData.contactId },
        types: [{
          associationCategory: "HUBSPOT_DEFINED",
          associationTypeId: 194 // Call-to-Contact association
        }]
      });
    }

    await hubspotClient.crm.objects.calls.basicApi.create(payload);
    console.log('HubSpot call logged successfully');
  } catch (error) {
    console.error('Failed to log HubSpot call:', error.message);
    // Optional: Implement retry logic or error reporting
  }
}

export async function logHubSpotEmail(contactData, emailType, aiSummary) {
  console.log("Logging email activity:", { contactData, emailType });
  try {
    const payload = {
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_email_subject: `${contactData.subject}`,
        hs_email_text: aiSummary || "Contact was sent deposit offer",
        hs_email_status: 'SENT',
        hs_email_direction: 'EMAIL',
      },
      associations: []
    };

    if (contactData.contactId) {
      payload.associations.push({
        to: { id: contactData.contactId },
        types: [{
          associationCategory: "HUBSPOT_DEFINED",
          associationTypeId: 198 // Email-to-Contact association
        }]
      });
    }

    await hubspotClient.crm.objects.emails.basicApi.create(payload);
    console.log('HubSpot email logged successfully');
  } catch (error) {
    console.error('Failed to log email:', error.message);
  }
}

export async function findContactByEmail(email) {
  try {
    const result = await hubspotClient.crm.contacts.searchApi.doSearch({
      filterGroups: [{
        filters: [{
          propertyName: 'email',
          operator: 'EQ',
          value: email
        }]
      }],
      properties: ['email', 'firstname', 'lastname', 'phone', 'hubspot_owner_id'],
      limit: 1
    });
    
    if (!result.results.length) return null;
    
    const contact = result.results[0];
    return {
      email: contact.properties.email,
      firstname: contact.properties.firstname,
      lastname: contact.properties.lastname,
      phone: contact.properties.phone,
      ownerId: contact.properties.hubspot_owner_id,
      contactId: contact.id
    };
  } catch (error) {
    console.error('HubSpot contact lookup failed:', error);
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const response = await hubspotClient.crm.products.basicApi.getPage(
      100, // Fetch first 100 products
      undefined, // No pagination token
      ['name', 'price', 'description', 'hs_sku'] // Only these properties
    );

    return response.results.map(p => ({
      id: p.id,
      name: p.properties.name,
      price: p.properties.price,
      description: p.properties.description || '',
      sku: p.properties.hs_sku || 'N/A'
    }));

  } catch (error) {
    console.error('Failed to fetch products:', error.message);
    throw error;
  }
}

export async function getBasicProducts() {
  try {
    // 1. Fetch all products (or use batchApi.read if you know exact IDs)
    const response = await hubspotClient.crm.products.basicApi.getPage(
      100,
      undefined,
      ['name', 'price', 'description', 'hs_sku']
    );

    // 2. Get IDs from your constants
    const basicProductIds = BASIC_PRODUCTS.map(p => p.id);

    // 3. Filter and merge with quantity config
    return response.results
      .filter(product => basicProductIds.includes(product.id))
      .map(product => {
        const config = BASIC_PRODUCTS.find(p => p.id === product.id);
        return {
          id: product.id,
          name: product.properties.name,
          price: product.properties.price,
          description: product.properties.description || '',
          quantity: config?.defaultQty || 1 // Fallback to 1 if not specified
        };
      });

  } catch (error) {
    console.error('Failed to fetch basic products:', error);
    throw error;
  }
}


export async function createBasicInvoice(contactEmail, products) {
  try {
    // 1. Find contact (using your existing function)
    const contact = await findContactByEmail(contactEmail);
    if (!contact) throw new Error(`Contact not found: ${contactEmail}`);

    // 2. Prepare line items with quantities
    const lineItems = products.map(product => ({
      properties: {
        name: product.name,
        price: product.price,
        quantity: product.quantity || 1, // Fallback to 1 if not specified
        hs_product_id: product.id,
        amount: (product.price * (product.quantity || 1)).toFixed(2)
      }
    }));

    // 3. Calculate total
    const total = lineItems.reduce((sum, item) => sum + parseFloat(item.properties.amount), 0);

    // 4. Create invoice
    const quote = await hubspotClient.crm.deals.getAll.create({
      properties: {
        // hs_title: `INV-${contact.properties.firstname}-${Date.now()}`,
        hs_invoice_status: 'CREATED',
        hs_amount: total,
        hs_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        custom_invoice_type: 'BASIC' // Optional for filtering
      }
    });

    console.log("created invoice:", invoice);

    // 5. Add line items
    await hubspotClient.crm.lineItems.batchApi.create({
      inputs: lineItems.map(item => ({
        ...item,
        properties: {
          ...item.properties,
          hs_invoice_id: invoice.id // Link to invoice
        }
      }))
    });

    // 6. Associate with contact
    await hubspotClient.crm.associations.batchApi.create([{
      from: { id: invoice.id, type: 'invoice' },
      to: { id: contact.id, type: 'contact' },
      type: 'invoice_to_contact'
    }]);

    console.log('Basic invoice created:', {
      invoiceId: invoice.id,
      contactId: contact.id,
      totalAmount: total
    });

    return invoice;

  } catch (error) {
    console.error('Invoice creation failed:', {
      contactEmail,
      error: error.message,
      stack: error.stack

    });
    throw error;
  }
}

// export async function createBasicQuote(contactEmail, dealId) {
//   try {
//     // 1. Find contact
//     const contact = await findContactByEmail(contactEmail);
//     if (!contact) throw new Error(`Contact not found: ${contactEmail}`);
//     const contactId = contact.id;

//     // 2. Create basic quote
//     const quote = await hubspotClient.crm.quotes.basicApi.create({
//       properties: {
//         hs_title: `Q-${Date.now().toString().slice(-4)}`,
//         hs_status: 'DRAFT',
//         hs_expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//         hs_language: 'en',
//       }
//     });

//     // 3. Create associations using V4 API
//     const associations = [
//       { toObjectType: 'deals', toObjectId: dealId },     // Associate with deal

//     ];


//     await hubspotClient.crm.associations.v4.basicApi.create(
//           quote.id,
//           toObjectType,
//           toObjectId,
//     )

//     console.log('Quote created and fully associated:', {
//       quoteId: quote.id,
//       contactId,
//       dealId,
    
//     });

//     return quote;

//   } catch (error) {
//     console.error('Quote creation failed:', {
//       contactEmail,
//       dealId,
//       error: error.message,
//       details: error.response?.body || 'No additional details'
//     });
//     throw error;
//   }
// }

export async function createBasicQuote(contactEmail, dealId, templateId = '411260347355') {
  try {
    // 1. Find contact
    const contact = await findContactByEmail(contactEmail);
    if (!contact) throw new Error(`Contact not found: ${contactEmail}`);
    
    const contactId = contact.contactId;
    const mycompanyId = '46732790736'; // Your company ID

    // 2. Create quote
    const quote = await hubspotClient.crm.quotes.basicApi.create({
      properties: {
        hs_title: `Quote - ${Date.now().toString().slice(-6)}`,
        hs_status: 'DRAFT',
        hs_expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hs_language: 'en',
        hs_payment_enabled: true,
        hs_payment_type: 'BYO_STRIPE',
        hs_allowed_payment_methods: 'CREDIT_OR_DEBIT_CARD',
        hs_currency: 'CAD',
        hs_quote_owner_id: '79703940' // Prepared By
      },
      associations: []
    });

    console.log("quote created:", quote);

    const quoteId = quote.id;

    // // 3. Create associations

    await hubspotClient.crm.associations.v4.basicApi.create(
      'company',
      mycompanyId,
      'deals',
      dealId,

    
      [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 6 }]
    )
    // Contact association
    await hubspotClient.crm.associations.v4.basicApi.create(
      'quotes',
      quoteId,
      'contacts',
      contactId,
      [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 69 }]
    );

    await hubspotClient.crm.associations.v4.basicApi.create(
      'deals',
      dealId,
      'contacts',
      contactId,
      [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
    )

    // Deal association
    const dealAssociation = await hubspotClient.crm.associations.v4.basicApi.create(
      'quotes',
      quoteId,
      'deals',
      dealId,
  
    
      [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 64 }]
    );
    console.log("deal association created:", dealAssociation)

    // Template association
    await hubspotClient.crm.associations.v4.basicApi.create(
      'quotes',
      quoteId,
      'quote_template',
      templateId,
      [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 286 }]
    );

   

    // 4. Create line items
    for (const product of BASIC_PRODUCTS) {
      const lineItem = await hubspotClient.crm.lineItems.basicApi.create({
        properties: {
          hs_product_id: product.id,
          quantity: product.defaultQty
        }
      });

      await hubspotClient.crm.associations.v4.basicApi.create(
        'line_items',
        lineItem.id,
        'quotes',
        quoteId,
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 68 }]
      );
    }

    return quote

  } catch (error) {
    console.error('❌ Quote creation failed:', {
      contactEmail,
      dealId,
      templateId,

    });
    throw error;
  }
}

export async function getAllDeals() {
  try {
    // 1. Fetch deals with essential properties
    const response = await hubspotClient.crm.deals.basicApi.getPage(
      100, // Limit
      undefined, // No pagination token
  
    );

    // 2. Transform results
    return response
  } catch (error) {
    console.error('Failed to fetch deals:', {
      message: error.message,
      status: error.statusCode,
      body: error.response?.body
    });
    throw error; // Re-throw for route handler
  }
}

export async function getAllQuotes() {

  try {
 
      const response = await hubspotClient.crm.quotes.getAll();

 
    return response;
  } catch (error) {
    console.error('Failed to retrieve quotes:', {
      message: error.message,
      details: error.response?.body || error,
    });
    throw error;
  }
}

export const zapierQuote = async (dealId, contactId, companyId = '46744670145', templateId = '411260347355') => {
  try {
    // 1. Create quote
    const quote = await hubspotClient.crm.quotes.basicApi.create({
      properties: {
        hs_title: `Q-${dealId.slice(-6)}-${Date.now().toString().slice(-4)}`,
        hs_status: "DRAFT",
        hs_expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        hs_language: 'en',
        hs_payment_enabled: true,
        hs_payment_type: 'BYO_STRIPE',
        hs_allowed_payment_methods: 'CREDIT_OR_DEBIT_CARD',
        hs_currency: 'CAD',
        hs_quote_owner_id: '79703940',
        hs_sender_firstname: 'Paul',
        hs_sender_lastname: 'Hendricks',
        hs_sender_email: '87hendricks@gmail.com',
        hs_sender_company_name: 'Cat6 Security'
        
      }
    });


    const quoteProperties = await hubspotClient.crm.properties.coreApi.getAll('quotes')
    console.log("first quote properties:", quoteProperties)
    const companies = await hubspotClient.crm.companies.getAll()
    console.log("companies:", companies)

    // 2. Create associations (deal + contact)
    await Promise.all([
      hubspotClient.crm.associations.v4.basicApi.create(
        'quotes',
        quote.id,
        'deals',
        dealId,
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 64 }]
      ),
      hubspotClient.crm.associations.v4.basicApi.create(
        'quotes',
        quote.id,
        'contacts',
        contactId,
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 69 }]
      ),
      hubspotClient.crm.associations.v4.basicApi.create(
        'quotes',
        quote.id,
        'quote_template',
        templateId,
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 286 }]
      ),
      // hubspotClient.crm.associations.v4.basicApi.create(
      //   'quotes',
      //   quote.id,
      //   'companies',
      //   companyId,
     
      //   [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 71 }]
      // )
      

    ]);

    // 3. Add line items
    for (const product of BASIC_PRODUCTS) {
      const lineItem = await hubspotClient.crm.lineItems.basicApi.create({
        properties: {
          name: product.name,
          quantity: product.defaultQty,
          price: product.price,
          hs_product_id: product.id
        }
      });

      await hubspotClient.crm.associations.v4.basicApi.create(
        'line_items',
        lineItem.id,
        'quotes',
        quote.id,
        [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 68 }]
      );
    }
    try {
      const result = await hubspotClient.crm.quotes.basicApi.update(quote.id, {
        properties: {
          hs_status: 'PENDING_APPROVAL',
        }
      });
      console.log('Quote status updated:', result);
    } catch (error) {
      console.error('Error updating quote status:', error.response ? error.response.body : error.message);
    }

    return {
      quoteId: quote.id,
  
    };

  } catch (error) {
    console.error('Quote creation failed:', {
      dealId,
      contactId,
      error: error.response?.body || error.message
    });
    throw new Error(`Quote failed: ${error.message}`);
  }
};

export async function getAllContacts() {
  try {
    const contacts = await hubspotClient.crm.contacts.getAll();
    return contacts.map((contact) => contact.properties);
  } catch (error) {
    console.error("Failed to fetch contacts:", error.message);
    throw error;
  }
}

async function createFollowUpTask(contactId, quoteUrl) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // Follow up in 3 days

  await hubspotClient.crm.tasks.basicApi.create({
    properties: {
      hs_task_subject: `Follow Up on Quote Sent (${quoteUrl})`,
      hs_task_status: "NOT_STARTED", // Mark as pending
      hs_task_type: "CALL", // Or "EMAIL" if preferred
      hs_timestamp: dueDate.toISOString(), // Due date
      hs_task_priority: "MEDIUM",
      associated_object_id: contactId,
      associated_object_type: "contact"
    }
  });
}

async function logSentEmail(contactId, quoteUrl) {
  await hubspotClient.crm.objects.emails.basicApi.create({
    properties: {
      hs_email_subject: "Quote Sent to Client",
      hs_email_text: `Sent quote to client. URL: ${quoteUrl}`,
      hs_email_status: "SENT",
      hs_email_direction: "OUTGOING_EMAIL",
      hs_timestamp: new Date().toISOString(),
      hs_object_id: contactId,
      hs_object_type: "CONTACT"
    }
  });
}

export async function logEmailAndScheduleFollowUp(contactEmail, quoteUrl) {
  try {
    const contact = await hubspotClient.crm.contacts.getByEmail(contactEmail);
    const contactId = contact.contactId;

    await logSentEmail(contactId, quoteUrl);


    await createFollowUpTask(contactId, quoteUrl);
    
  } catch (error) {
    console.error('Failed to log email and schedule follow-up:', error.message);
    throw error;
  }
}