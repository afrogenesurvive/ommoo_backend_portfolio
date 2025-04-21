
const contactSchema = `
  type Contact {
    id: ID!
    entity_type: String!
    entity_id: ID!
    primary: Boolean
    phone: String
    phone2: String
    email: String
    address: String
    address2: String
    state: String
    city: String
    country: String
    postal_code: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    user: User
    production_company: ProductionCompany
    venue: Venue
    event: Event
    show: Show
  }
  
  input ContactInput {
    entity_type: String
    entity_id: ID
    primary: Boolean
    phone: String
    phone2: String
    email: String
    address: String
    address2: String
    state: String
    city: String
    country: String
    postal_code: String
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllContacts(args: String): [Contact]
    getContact(id: ID!): Contact
    getContactByQuery(args: String!): [Contact]
  }

  type Mutation {
    createContact(contactInput: ContactInput!): Contact
    updateContact(id: ID!, contactInput: ContactInput!): Contact
    deleteContact(id: ID!): Contact
  }


`;
module.exports = contactSchema;