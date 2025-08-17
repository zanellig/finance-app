#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Import backend services and models
import db from "./services/db";
import authService from "./services/auth";
import { users } from "./models/users.model";
import { entities } from "./models/entities.model";
import { accounts } from "./models/accounts.model";
import { creditCards } from "./models/credit-cards.model";
import { loans } from "./models/loans.model";
import { income } from "./models/income.model";
import { transactions, creditCardTransactions } from "./models/transactions.model";
import { eq, and, ne } from "drizzle-orm";

// Import types and enums for single source of truth
import { EntityType } from "./types/entities.types";
import { AccountType } from "./types/accounts.types";
import { CreditCardStatus } from "./types/credit-cards.types";
import { IncomeFrequency } from "./types/income.types";
import { AmortizationStrategy, Currency } from "./types/loans.types";
import { TransactionType, TransactionStatus } from "./types/transactions.types";

// Import DTOs for validation
import {
  getEntitiesDto,
  getEntityDto,
  createEntityResponseDto,
} from "./dtos/entities.dto";
import {
  getAccountsDto,
  getAccountDto,
  createAccountResponseDto,
} from "./dtos/accounts.dto";
import {
  getCreditCardsDto,
  getCreditCardDto,
  createCreditCardResponseDto,
} from "./dtos/credit-cards.dto";
import {
  getLoansDto,
  getLoanDto,
  createLoanResponseDto,
} from "./dtos/loans.dto";
import {
  getIncomesDto,
  getIncomeDto,
  createIncomeResponseDto,
} from "./dtos/income.dto";
import {
  getTransactionsDto,
  getTransactionDto,
  createTransactionResponseDto,
  getCreditCardTransactionsDto,
  getCreditCardTransactionDto,
  createCreditCardTransactionResponseDto,
} from "./dtos/transactions.dto";

// Authentication helper
async function authenticateUser(token: string) {
  if (!token) {
    throw new McpError(ErrorCode.InvalidRequest, "Authentication token required");
  }

  const payload = authService.verifyToken(token);
  if (!payload) {
    throw new McpError(ErrorCode.InvalidRequest, "Invalid or expired token");
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
    })
    .from(users)
    .where(eq(users.id, payload.userId));

  if (!user) {
    throw new McpError(ErrorCode.InvalidRequest, "User not found");
  }

  return user;
}

// Type-safe argument validation
function validateArgs<T>(args: unknown, validator: (args: unknown) => args is T): T {
  if (!validator(args)) {
    throw new McpError(ErrorCode.InvalidParams, "Invalid arguments provided");
  }
  return args;
}

// Argument validators
const isTokenArgs = (args: unknown): args is { token: string } => {
  return typeof args === 'object' && args !== null && 'token' in args && typeof (args as Record<string, unknown>).token === 'string';
};

const isTokenWithIdArgs = (args: unknown): args is { token: string; id: string } => {
  return isTokenArgs(args) && 'id' in args && typeof (args as Record<string, unknown>).id === 'string';
};

const isCreateEntityArgs = (args: unknown): args is { token: string; name: string; type?: string } => {
  return isTokenArgs(args) && 'name' in args && typeof (args as Record<string, unknown>).name === 'string';
};

const isCreateAccountArgs = (args: unknown): args is { 
  token: string; 
  name: string; 
  type: string; 
  entityId: string; 
  balance?: string;
  annualNominalRate?: string;
  isSalaryAccount?: boolean;
  overdraftLimit?: string;
} => {
  const a = args as Record<string, unknown>;
  return isTokenArgs(args) && 
    'name' in args && typeof a.name === 'string' &&
    'type' in args && typeof a.type === 'string' &&
    'entityId' in args && typeof a.entityId === 'string';
};

const isCreateCreditCardArgs = (args: unknown): args is { 
  token: string; 
  name: string; 
  entityId: string; 
  limit: string;
  expiration: string;
  number?: string;
  description?: string;
  closingDay?: number;
} => {
  const a = args as Record<string, unknown>;
  return isTokenArgs(args) && 
    'name' in args && typeof a.name === 'string' &&
    'entityId' in args && typeof a.entityId === 'string' &&
    'limit' in args && typeof a.limit === 'string' &&
    'expiration' in args && typeof a.expiration === 'string';
};

const isCreateLoanArgs = (args: unknown): args is { 
  token: string; 
  name?: string; 
  entityId: string; 
  initialCapital: string;
  annualInterestRate: string;
  installments: number;
  currency: string;
  amortizationStrategy?: string;
} => {
  const a = args as Record<string, unknown>;
  return isTokenArgs(args) && 
    'entityId' in args && typeof a.entityId === 'string' &&
    'initialCapital' in args && typeof a.initialCapital === 'string' &&
    'annualInterestRate' in args && typeof a.annualInterestRate === 'string' &&
    'installments' in args && typeof a.installments === 'number' &&
    'currency' in args && typeof a.currency === 'string';
};

const isCreateIncomeArgs = (args: unknown): args is { 
  token: string; 
  name: string; 
  amount: string; 
  frequency: string; 
  startDate?: string;
  endDate?: string;
  isHourly?: boolean;
} => {
  const a = args as Record<string, unknown>;
  return isTokenArgs(args) && 
    'name' in args && typeof a.name === 'string' &&
    'amount' in args && typeof a.amount === 'string' &&
    'frequency' in args && typeof a.frequency === 'string';
};

const isCreateTransactionArgs = (args: unknown): args is { 
  token: string; 
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  type: string;
  currency: string;
  loanId?: string;
} => {
  const a = args as Record<string, unknown>;
  return isTokenArgs(args) && 
    'fromAccountId' in args && typeof a.fromAccountId === 'string' &&
    'toAccountId' in args && typeof a.toAccountId === 'string' &&
    'amount' in args && typeof a.amount === 'string' &&
    'type' in args && typeof a.type === 'string' &&
    'currency' in args && typeof a.currency === 'string';
};

const isCreateCreditCardTransactionArgs = (args: unknown): args is { 
  token: string; 
  creditCardId: string;
  amount: string;
  currency: string;
  isInstallment?: boolean;
  installments?: number;
  currentInstallment?: number;
} => {
  const a = args as Record<string, unknown>;
  return isTokenArgs(args) && 
    'creditCardId' in args && typeof a.creditCardId === 'string' &&
    'amount' in args && typeof a.amount === 'string' &&
    'currency' in args && typeof a.currency === 'string';
};

const isUpdateArgs = (args: unknown): args is { token: string; id: string; [key: string]: unknown } => {
  return isTokenWithIdArgs(args);
};

// Create the server
const server = new Server(
  {
    name: "finance-tracker-api",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Entities
      {
        name: "get_entities",
        description: "Get all entities for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_entity",
        description: "Get a specific entity by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Entity ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_entity",
        description: "Create a new entity",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            name: { type: "string", description: "Entity name" },
            type: { 
              type: "string", 
              description: "Entity type", 
              enum: Object.values(EntityType),
            },
          },
          required: ["token", "name"],
        },
      },

      // Accounts
      {
        name: "get_accounts",
        description: "Get all accounts for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_account",
        description: "Get a specific account by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Account ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_account",
        description: "Create a new account",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            name: { type: "string", description: "Account name" },
            type: { 
              type: "string", 
              description: "Account type", 
              enum: Object.values(AccountType),
            },
            entityId: { type: "string", description: "Entity ID this account belongs to" },
            balance: { type: "string", description: "Initial balance (decimal format)", default: "0.00" },
            annualNominalRate: { type: "string", description: "Annual nominal rate (decimal format)", default: "0.00" },
            isSalaryAccount: { type: "boolean", description: "Is this a salary account", default: false },
            overdraftLimit: { type: "string", description: "Overdraft limit (decimal format)", default: "0.00" },
          },
          required: ["token", "name", "type", "entityId"],
        },
      },
      {
        name: "update_account",
        description: "Update an existing account",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Account ID" },
            name: { type: "string", description: "Account name" },
            type: { type: "string", description: "Account type" },
            balance: { type: "string", description: "Account balance (decimal format)" },
            annualNominalRate: { type: "string", description: "Annual nominal rate (decimal format)" },
            isSalaryAccount: { type: "boolean", description: "Is this a salary account" },
            overdraftLimit: { type: "string", description: "Overdraft limit (decimal format)" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "delete_account",
        description: "Delete an account",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Account ID" },
          },
          required: ["token", "id"],
        },
      },

      // Credit Cards
      {
        name: "get_credit_cards",
        description: "Get all credit cards for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_credit_card",
        description: "Get a specific credit card by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Credit card ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_credit_card",
        description: "Create a new credit card",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            name: { type: "string", description: "Credit card name" },
            entityId: { type: "string", description: "Entity ID this credit card belongs to" },
            limit: { type: "string", description: "Credit limit (decimal format)" },
            expiration: { type: "string", description: "Expiration date (ISO string)" },
            number: { type: "string", description: "Card number (16 digits, optional)" },
            description: { type: "string", description: "Card description (optional)" },
            closingDay: { type: "number", description: "Closing day of month", default: 30 },
          },
          required: ["token", "name", "entityId", "limit", "expiration"],
        },
      },
      {
        name: "update_credit_card",
        description: "Update an existing credit card",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Credit card ID" },
            name: { type: "string", description: "Credit card name" },
            limit: { type: "string", description: "Credit limit (decimal format)" },
            number: { type: "string", description: "Card number (16 digits)" },
            description: { type: "string", description: "Card description" },
            closingDay: { type: "number", description: "Closing day of month" },
            status: { 
              type: "string", 
              description: "Credit card status",
              enum: Object.values(CreditCardStatus),
            },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "delete_credit_card",
        description: "Delete a credit card (soft delete)",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Credit card ID" },
          },
          required: ["token", "id"],
        },
      },

      // Loans
      {
        name: "get_loans",
        description: "Get all loans for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_loan",
        description: "Get a specific loan by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Loan ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_loan",
        description: "Create a new loan",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            name: { type: "string", description: "Loan name (optional)" },
            entityId: { type: "string", description: "Entity ID this loan belongs to" },
            initialCapital: { type: "string", description: "Initial capital amount (decimal format)" },
            annualInterestRate: { type: "string", description: "Annual interest rate (decimal format)" },
            installments: { type: "number", description: "Total number of installments" },
            currency: { 
              type: "string", 
              description: "Currency",
              enum: Object.values(Currency),
            },
            amortizationStrategy: { 
              type: "string", 
              description: "Amortization strategy (optional)",
              enum: Object.values(AmortizationStrategy),
            },
          },
          required: ["token", "entityId", "initialCapital", "annualInterestRate", "installments", "currency"],
        },
      },
      {
        name: "update_loan",
        description: "Update an existing loan",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Loan ID" },
            name: { type: "string", description: "Loan name" },
            initialCapital: { type: "string", description: "Initial capital amount (decimal format)" },
            annualInterestRate: { type: "string", description: "Annual interest rate (decimal format)" },
            installments: { type: "number", description: "Total number of installments" },
            remainingInstallments: { type: "number", description: "Remaining installments" },
            remainingCapital: { type: "string", description: "Remaining capital (decimal format)" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "delete_loan",
        description: "Delete a loan",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Loan ID" },
          },
          required: ["token", "id"],
        },
      },

      // Income
      {
        name: "get_income",
        description: "Get all income records for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_income_record",
        description: "Get a specific income record by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Income record ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_income",
        description: "Create a new income record",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            name: { type: "string", description: "Income source name" },
            amount: { type: "string", description: "Income amount (decimal format)" },
            frequency: { 
              type: "string", 
              description: "Income frequency", 
              enum: Object.values(IncomeFrequency),
            },
            startDate: { type: "string", description: "Start date (ISO string, optional)" },
            endDate: { type: "string", description: "End date (ISO string, optional)" },
            isHourly: { type: "boolean", description: "Is hourly income", default: false },
          },
          required: ["token", "name", "amount", "frequency"],
        },
      },
      {
        name: "update_income",
        description: "Update an existing income record",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Income record ID" },
            name: { type: "string", description: "Income source name" },
            amount: { type: "string", description: "Income amount (decimal format)" },
            frequency: { type: "string", description: "Income frequency" },
            startDate: { type: "string", description: "Start date (ISO string)" },
            endDate: { type: "string", description: "End date (ISO string)" },
            isHourly: { type: "boolean", description: "Is hourly income" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "delete_income",
        description: "Delete an income record",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Income record ID" },
          },
          required: ["token", "id"],
        },
      },

      // Transactions
      {
        name: "get_transactions",
        description: "Get all transactions for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_transaction",
        description: "Get a specific transaction by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Transaction ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_transaction",
        description: "Create a new transaction between accounts",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            fromAccountId: { type: "string", description: "Source account ID" },
            toAccountId: { type: "string", description: "Destination account ID" },
            amount: { type: "string", description: "Transaction amount (decimal format)" },
            type: { 
              type: "string", 
              description: "Transaction type",
              enum: Object.values(TransactionType),
            },
            currency: { 
              type: "string", 
              description: "Currency",
              enum: Object.values(Currency),
            },
            loanId: { type: "string", description: "Associated loan ID (optional)" },
          },
          required: ["token", "fromAccountId", "toAccountId", "amount", "type", "currency"],
        },
      },
      {
        name: "update_transaction",
        description: "Update an existing transaction",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Transaction ID" },
            amount: { type: "string", description: "Transaction amount (decimal format)" },
            type: { type: "string", description: "Transaction type" },
            currency: { type: "string", description: "Currency" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "delete_transaction",
        description: "Delete a transaction",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Transaction ID" },
          },
          required: ["token", "id"],
        },
      },

      // Credit Card Transactions
      {
        name: "get_credit_card_transactions",
        description: "Get all credit card transactions for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
      {
        name: "get_credit_card_transaction",
        description: "Get a specific credit card transaction by ID",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Credit card transaction ID" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "create_credit_card_transaction",
        description: "Create a new credit card transaction",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            creditCardId: { type: "string", description: "Credit card ID" },
            amount: { type: "string", description: "Transaction amount (decimal format)" },
            currency: { 
              type: "string", 
              description: "Currency",
              enum: Object.values(Currency),
            },
            isInstallment: { type: "boolean", description: "Is installment transaction", default: false },
            installments: { type: "number", description: "Number of installments (optional)" },
            currentInstallment: { type: "number", description: "Current installment (optional)" },
          },
          required: ["token", "creditCardId", "amount", "currency"],
        },
      },
      {
        name: "update_credit_card_transaction",
        description: "Update an existing credit card transaction",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Credit card transaction ID" },
            amount: { type: "string", description: "Transaction amount (decimal format)" },
            currency: { type: "string", description: "Currency" },
            status: { 
              type: "string", 
              description: "Transaction status",
              enum: Object.values(TransactionStatus),
            },
            isInstallment: { type: "boolean", description: "Is installment transaction" },
            installments: { type: "number", description: "Number of installments" },
            currentInstallment: { type: "number", description: "Current installment" },
          },
          required: ["token", "id"],
        },
      },
      {
        name: "delete_credit_card_transaction",
        description: "Delete a credit card transaction",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
            id: { type: "string", description: "Credit card transaction ID" },
          },
          required: ["token", "id"],
        },
      },

      // User profile
      {
        name: "get_user_profile",
        description: "Get current user profile information",
        inputSchema: {
          type: "object",
          properties: {
            token: { type: "string", description: "JWT authentication token" },
          },
          required: ["token"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Entities
      case "get_entities": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const entitiesRes = await db
          .select()
          .from(entities)
          .where(and(eq(entities.userId, user.id), ne(entities.status, "deleted")));
        
        const entitiesDtoResult = getEntitiesDto.safeParse(entitiesRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: entitiesDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_entity": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [entityRes] = await db
          .select()
          .from(entities)
          .where(and(eq(entities.id, validArgs.id), eq(entities.userId, user.id), ne(entities.status, "deleted")));

        if (!entityRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Entity not found");
        }

        const entityDtoResult = getEntityDto.safeParse(entityRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: entityDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_entity": {
        const validArgs = validateArgs(args, isCreateEntityArgs);
        const user = await authenticateUser(validArgs.token);
        const { name, type } = validArgs;
        
        const [entityRes] = await db
          .insert(entities)
          .values({
            name,
            type: (type as EntityType) || EntityType.Bank,
            userId: user.id,
          })
          .$returningId();

        const entityDtoResult = createEntityResponseDto.safeParse(entityRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Entity created successfully",
                data: entityDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      // Accounts
      case "get_accounts": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const accountsRes = await db
          .select()
          .from(accounts)
          .innerJoin(entities, eq(accounts.entityId, entities.id))
          .where(and(eq(entities.userId, user.id), ne(accounts.status, "deleted"), ne(entities.status, "deleted")));
        
        const accountsDtoResult = getAccountsDto.safeParse(accountsRes.map(result => result.accounts));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: accountsDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_account": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [accountRes] = await db
          .select()
          .from(accounts)
          .innerJoin(entities, eq(accounts.entityId, entities.id))
          .where(and(eq(accounts.id, validArgs.id), eq(entities.userId, user.id), ne(accounts.status, "deleted"), ne(entities.status, "deleted")));

        if (!accountRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Account not found");
        }

        const accountDtoResult = getAccountDto.safeParse(accountRes.accounts);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: accountDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_account": {
        const validArgs = validateArgs(args, isCreateAccountArgs);
        const user = await authenticateUser(validArgs.token);
        const { name, type, entityId, balance, annualNominalRate, isSalaryAccount, overdraftLimit } = validArgs;
        
        // Verify entity belongs to user
        const [entity] = await db
          .select({ id: entities.id })
          .from(entities)
          .where(and(eq(entities.id, entityId), eq(entities.userId, user.id)));

        if (!entity) {
          throw new McpError(ErrorCode.InvalidRequest, "Entity not found or unauthorized");
        }

        // Check if account with same name already exists for this entity
        const [existingAccount] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .where(and(eq(accounts.name, name), eq(accounts.entityId, entityId)));

        if (existingAccount) {
          throw new McpError(ErrorCode.InvalidRequest, "Account already exists");
        }

        const [res] = await db
          .insert(accounts)
          .values({ 
            name, 
            type: type as AccountType, 
            entityId,
            balance: balance || "0.00",
            annualNominalRate: annualNominalRate || "0.00",
            isSalaryAccount: isSalaryAccount || false,
            overdraftLimit: overdraftLimit || "0.00",
          })
          .$returningId();

        const responseDtoResult = createAccountResponseDto.safeParse(res);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Account created successfully",
                data: responseDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "update_account": {
        const validArgs = validateArgs(args, isUpdateArgs);
        const user = await authenticateUser(validArgs.token);
        const { id, token, ...updateData } = validArgs;
        void token; // Consume token to avoid unused variable warning

        // Verify account belongs to user through entity
        const [accountCheck] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .innerJoin(entities, eq(accounts.entityId, entities.id))
          .where(and(eq(accounts.id, id), eq(entities.userId, user.id)));

        if (!accountCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Account not found or access denied");
        }

        await db
          .update(accounts)
          .set(updateData)
          .where(eq(accounts.id, id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Account updated successfully",
              }, null, 2),
            },
          ],
        };
      }

      case "delete_account": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        // Verify account belongs to user through entity
        const [accountCheck] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .innerJoin(entities, eq(accounts.entityId, entities.id))
          .where(and(eq(accounts.id, validArgs.id), eq(entities.userId, user.id)));

        if (!accountCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Account not found or access denied");
        }

        await db.update(accounts).set({
          status: "deleted",
          deletedAt: new Date()
        }).where(eq(accounts.id, validArgs.id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Account deleted successfully",
              }, null, 2),
            },
          ],
        };
      }

      // Credit Cards
      case "get_credit_cards": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const creditCardsRes = await db
          .select()
          .from(creditCards)
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(entities.userId, user.id), ne(creditCards.status, "deleted"), ne(entities.status, "deleted")));
        
        const creditCardsDtoResult = getCreditCardsDto.safeParse(creditCardsRes.map(result => result.credit_cards));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: creditCardsDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_credit_card": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [creditCardRes] = await db
          .select()
          .from(creditCards)
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCards.id, validArgs.id), eq(entities.userId, user.id)));

        if (!creditCardRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card not found");
        }

        const creditCardDtoResult = getCreditCardDto.safeParse(creditCardRes.credit_cards);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: creditCardDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_credit_card": {
        const validArgs = validateArgs(args, isCreateCreditCardArgs);
        const user = await authenticateUser(validArgs.token);
        const { name, entityId, limit, expiration, number, description, closingDay } = validArgs;
        
        // Verify entity belongs to user
        const [entity] = await db
          .select({ id: entities.id })
          .from(entities)
          .where(and(eq(entities.id, entityId), eq(entities.userId, user.id)));

        if (!entity) {
          throw new McpError(ErrorCode.InvalidRequest, "Entity not found or unauthorized");
        }

        // Check if credit card with same name already exists for this entity
        const [existingCreditCard] = await db
          .select({ id: creditCards.id })
          .from(creditCards)
          .where(and(eq(creditCards.name, name), eq(creditCards.entityId, entityId)));

        if (existingCreditCard) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card already exists");
        }

        const [res] = await db
          .insert(creditCards)
          .values({ 
            name, 
            entityId, 
            limit,
            expiration: new Date(expiration),
            number,
            description,
            closingDay: closingDay || 30,
          })
          .$returningId();

        const responseDtoResult = createCreditCardResponseDto.safeParse(res);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Credit card created successfully",
                data: responseDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "update_credit_card": {
        const validArgs = validateArgs(args, isUpdateArgs);
        const user = await authenticateUser(validArgs.token);
        const { id, token, ...updateData } = validArgs;
        void token; // Consume token to avoid unused variable warning

        // Verify credit card belongs to user through entity
        const [creditCardRes] = await db
          .select()
          .from(creditCards)
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCards.id, id), eq(entities.userId, user.id)));

        if (!creditCardRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card not found");
        }

        await db
          .update(creditCards)
          .set(updateData)
          .where(eq(creditCards.id, id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Credit card updated successfully",
              }, null, 2),
            },
          ],
        };
      }

      case "delete_credit_card": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        // Verify credit card belongs to user through entity
        const [creditCardRes] = await db
          .select()
          .from(creditCards)
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCards.id, validArgs.id), eq(entities.userId, user.id)));

        if (!creditCardRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card not found");
        }

        await db
          .update(creditCards)
          .set({ 
            status: CreditCardStatus.Deleted,
            deletedAt: new Date()
          })
          .where(eq(creditCards.id, validArgs.id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Credit card deleted successfully",
              }, null, 2),
            },
          ],
        };
      }

      // Loans
      case "get_loans": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const loansRes = await db
          .select()
          .from(loans)
          .innerJoin(entities, eq(loans.entityId, entities.id))
          .where(eq(entities.userId, user.id));
        
        const loansDtoResult = getLoansDto.safeParse(loansRes.map(result => result.loans));
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: loansDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_loan": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [loanRes] = await db
          .select()
          .from(loans)
          .innerJoin(entities, eq(loans.entityId, entities.id))
          .where(and(eq(loans.id, validArgs.id), eq(entities.userId, user.id)));

        if (!loanRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Loan not found");
        }

        const loanDtoResult = getLoanDto.safeParse(loanRes.loans);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: loanDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_loan": {
        const validArgs = validateArgs(args, isCreateLoanArgs);
        const user = await authenticateUser(validArgs.token);
        const { name, entityId, initialCapital, annualInterestRate, installments, currency, amortizationStrategy } = validArgs;
        
        // Verify entity belongs to user
        const [entity] = await db
          .select({ id: entities.id })
          .from(entities)
          .where(and(eq(entities.id, entityId), eq(entities.userId, user.id)));

        if (!entity) {
          throw new McpError(ErrorCode.InvalidRequest, "Entity not found or unauthorized");
        }

        const [res] = await db
          .insert(loans)
          .values({ 
            name,
            entityId, 
            initialCapital,
            annualInterestRate,
            installments,
            remainingInstallments: installments,
            totalAnnualFinancedCost: initialCapital, // Simplified calculation
            currency: currency as Currency,
            remainingCapital: initialCapital,
            amortizationStrategy: (amortizationStrategy as AmortizationStrategy) || AmortizationStrategy.French,
            consolidatedAt: new Date(), // Required field
          })
          .$returningId();

        const responseDtoResult = createLoanResponseDto.safeParse(res);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Loan created successfully",
                data: responseDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "update_loan": {
        const validArgs = validateArgs(args, isUpdateArgs);
        const user = await authenticateUser(validArgs.token);
        const { id, token, ...updateData } = validArgs;
        void token; // Consume token to avoid unused variable warning

        // Verify loan belongs to user through entity
        const [loanRes] = await db
          .select()
          .from(loans)
          .innerJoin(entities, eq(loans.entityId, entities.id))
          .where(and(eq(loans.id, id), eq(entities.userId, user.id)));

        if (!loanRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Loan not found");
        }

        await db
          .update(loans)
          .set(updateData)
          .where(eq(loans.id, id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Loan updated successfully",
              }, null, 2),
            },
          ],
        };
      }

      case "delete_loan": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        // Verify loan belongs to user through entity
        const [loanRes] = await db
          .select()
          .from(loans)
          .innerJoin(entities, eq(loans.entityId, entities.id))
          .where(and(eq(loans.id, validArgs.id), eq(entities.userId, user.id)));

        if (!loanRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Loan not found");
        }

        await db
          .update(loans)
          .set({
            status: "deleted",
            deletedAt: new Date()
          })
          .where(eq(loans.id, validArgs.id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Loan deleted successfully",
              }, null, 2),
            },
          ],
        };
      }

      // Income
      case "get_income": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const incomeRes = await db
          .select()
          .from(income)
          .where(eq(income.userId, user.id));

        const incomeDtoResult = getIncomesDto.safeParse(incomeRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: incomeDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_income_record": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [incomeRes] = await db
          .select()
          .from(income)
          .where(and(eq(income.id, validArgs.id), eq(income.userId, user.id)));

        if (!incomeRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Income record not found");
        }

        const incomeDtoResult = getIncomeDto.safeParse(incomeRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: incomeDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_income": {
        const validArgs = validateArgs(args, isCreateIncomeArgs);
        const user = await authenticateUser(validArgs.token);
        const { name, amount, frequency, startDate, endDate, isHourly } = validArgs;
        
        // Check if income with same name already exists for this user
        const [existingIncome] = await db
          .select({ id: income.id })
          .from(income)
          .where(and(eq(income.name, name), eq(income.userId, user.id)));

        if (existingIncome) {
          throw new McpError(ErrorCode.InvalidRequest, "Income already exists");
        }

        const [res] = await db
          .insert(income)
          .values({ 
            name, 
            amount, 
            frequency: frequency as IncomeFrequency, 
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : undefined,
            isHourly: isHourly || false,
            userId: user.id 
          })
          .$returningId();

        const responseDtoResult = createIncomeResponseDto.safeParse(res);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Income created successfully",
                data: responseDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "update_income": {
        const validArgs = validateArgs(args, isUpdateArgs);
        const user = await authenticateUser(validArgs.token);
        const { id, token, ...updateData } = validArgs;
        void token; // Consume token to avoid unused variable warning

        // Verify income belongs to user
        const [incomeCheck] = await db
          .select({ id: income.id })
          .from(income)
          .where(and(eq(income.id, id), eq(income.userId, user.id)));

        if (!incomeCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Income not found or access denied");
        }

        // Convert date strings to Date objects if present
        if (updateData.startDate && typeof updateData.startDate === 'string') {
          updateData.startDate = new Date(updateData.startDate);
        }
        if (updateData.endDate && typeof updateData.endDate === 'string') {
          updateData.endDate = new Date(updateData.endDate);
        }

        await db.update(income).set(updateData).where(eq(income.id, id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Income updated successfully",
              }, null, 2),
            },
          ],
        };
      }

      case "delete_income": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        // Verify income belongs to user
        const [incomeCheck] = await db
          .select({ id: income.id })
          .from(income)
          .where(and(eq(income.id, validArgs.id), eq(income.userId, user.id)));

        if (!incomeCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Income not found or access denied");
        }

        await db.update(income).set({
          status: "deleted",
          deletedAt: new Date()
        }).where(eq(income.id, validArgs.id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Income deleted successfully",
              }, null, 2),
            },
          ],
        };
      }

      // Transactions
      case "get_transactions": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const transactionsRes = await db
          .select()
          .from(transactions)
          .where(eq(transactions.userId, user.id));
        
        const transactionsDtoResult = getTransactionsDto.safeParse(transactionsRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: transactionsDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_transaction": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [transactionRes] = await db
          .select()
          .from(transactions)
          .where(and(eq(transactions.id, validArgs.id), eq(transactions.userId, user.id)));

        if (!transactionRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Transaction not found");
        }

        const transactionDtoResult = getTransactionDto.safeParse(transactionRes);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: transactionDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_transaction": {
        const validArgs = validateArgs(args, isCreateTransactionArgs);
        const user = await authenticateUser(validArgs.token);
        const { fromAccountId, toAccountId, amount, type, currency, loanId } = validArgs;
        
        // Verify both accounts belong to entities owned by the user
        const [fromAccount] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .innerJoin(entities, eq(accounts.entityId, entities.id))
          .where(and(eq(accounts.id, fromAccountId), eq(entities.userId, user.id)));

        const [toAccount] = await db
          .select({ id: accounts.id })
          .from(accounts)
          .innerJoin(entities, eq(accounts.entityId, entities.id))
          .where(and(eq(accounts.id, toAccountId), eq(entities.userId, user.id)));

        if (!fromAccount || !toAccount) {
          throw new McpError(ErrorCode.InvalidRequest, "One or both accounts not found or access denied");
        }

        const [res] = await db
          .insert(transactions)
          .values({ 
            fromAccountId, 
            toAccountId, 
            amount, 
            type: type as TransactionType,
            currency: currency as Currency,
            loanId,
            userId: user.id 
          })
          .$returningId();

        const responseDtoResult = createTransactionResponseDto.safeParse(res);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Transaction created successfully",
                data: responseDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "update_transaction": {
        const validArgs = validateArgs(args, isUpdateArgs);
        const user = await authenticateUser(validArgs.token);
        const { id, token, ...updateData } = validArgs;
        void token; // Consume token to avoid unused variable warning

        // Verify transaction belongs to user
        const [transactionCheck] = await db
          .select({ id: transactions.id })
          .from(transactions)
          .where(and(eq(transactions.id, id), eq(transactions.userId, user.id)));

        if (!transactionCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Transaction not found or access denied");
        }

        await db
          .update(transactions)
          .set(updateData)
          .where(eq(transactions.id, id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Transaction updated successfully",
              }, null, 2),
            },
          ],
        };
      }

      case "delete_transaction": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        // Verify transaction belongs to user
        const [transactionCheck] = await db
          .select({ id: transactions.id })
          .from(transactions)
          .where(and(eq(transactions.id, validArgs.id), eq(transactions.userId, user.id)));

        if (!transactionCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Transaction not found or access denied");
        }

        await db.update(transactions).set({
          status: "deleted",
          deletedAt: new Date()
        }).where(eq(transactions.id, validArgs.id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Transaction deleted successfully",
              }, null, 2),
            },
          ],
        };
      }

      // Credit Card Transactions
      case "get_credit_card_transactions": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        const ccTransactionsRes = await db
          .select()
          .from(creditCardTransactions)
          .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(eq(entities.userId, user.id));
        
        const ccTransactionsDtoResult = getCreditCardTransactionsDto.safeParse(
          ccTransactionsRes.map(result => result.credit_card_transactions)
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: ccTransactionsDtoResult.data || [],
              }, null, 2),
            },
          ],
        };
      }

      case "get_credit_card_transaction": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        const [ccTransactionRes] = await db
          .select()
          .from(creditCardTransactions)
          .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCardTransactions.id, validArgs.id), eq(entities.userId, user.id)));

        if (!ccTransactionRes) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card transaction not found");
        }

        const ccTransactionDtoResult = getCreditCardTransactionDto.safeParse(ccTransactionRes.credit_card_transactions);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: ccTransactionDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "create_credit_card_transaction": {
        const validArgs = validateArgs(args, isCreateCreditCardTransactionArgs);
        const user = await authenticateUser(validArgs.token);
        const { creditCardId, amount, currency, isInstallment, installments, currentInstallment } = validArgs;
        
        // Verify credit card belongs to entity owned by the user
        const [creditCard] = await db
          .select({ id: creditCards.id })
          .from(creditCards)
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCards.id, creditCardId), eq(entities.userId, user.id)));

        if (!creditCard) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card not found or access denied");
        }

        const [res] = await db
          .insert(creditCardTransactions)
          .values({ 
            creditCardId, 
            amount, 
            currency: currency as Currency,
            status: TransactionStatus.Approved,
            isInstallment: isInstallment || false,
            installments: installments || 0,
            currentInstallment: currentInstallment || 0,
          })
          .$returningId();

        const responseDtoResult = createCreditCardTransactionResponseDto.safeParse(res);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Credit card transaction created successfully",
                data: responseDtoResult.data,
              }, null, 2),
            },
          ],
        };
      }

      case "update_credit_card_transaction": {
        const validArgs = validateArgs(args, isUpdateArgs);
        const user = await authenticateUser(validArgs.token);
        const { id, token, ...updateData } = validArgs;
        void token; // Consume token to avoid unused variable warning

        // Verify credit card transaction belongs to user through credit card and entity
        const [ccTransactionCheck] = await db
          .select({ id: creditCardTransactions.id })
          .from(creditCardTransactions)
          .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCardTransactions.id, id), eq(entities.userId, user.id)));

        if (!ccTransactionCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card transaction not found or access denied");
        }

        await db
          .update(creditCardTransactions)
          .set(updateData)
          .where(eq(creditCardTransactions.id, id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Credit card transaction updated successfully",
              }, null, 2),
            },
          ],
        };
      }

      case "delete_credit_card_transaction": {
        const validArgs = validateArgs(args, isTokenWithIdArgs);
        const user = await authenticateUser(validArgs.token);
        
        // Verify credit card transaction belongs to user through credit card and entity
        const [ccTransactionCheck] = await db
          .select({ id: creditCardTransactions.id })
          .from(creditCardTransactions)
          .innerJoin(creditCards, eq(creditCardTransactions.creditCardId, creditCards.id))
          .innerJoin(entities, eq(creditCards.entityId, entities.id))
          .where(and(eq(creditCardTransactions.id, validArgs.id), eq(entities.userId, user.id)));

        if (!ccTransactionCheck) {
          throw new McpError(ErrorCode.InvalidRequest, "Credit card transaction not found or access denied");
        }

        await db.update(creditCardTransactions).set({
          recordStatus: "deleted",
          deletedAt: new Date()
        }).where(eq(creditCardTransactions.id, validArgs.id));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Credit card transaction deleted successfully",
              }, null, 2),
            },
          ],
        };
      }

      // User profile
      case "get_user_profile": {
        const validArgs = validateArgs(args, isTokenArgs);
        const user = await authenticateUser(validArgs.token);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                data: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    console.error("Tool execution error:", error);
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Finance Tracker MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});