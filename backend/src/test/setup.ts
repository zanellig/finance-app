// Test configuration
process.env.NODE_ENV = "development";
process.env.MYSQL_URL = "mysql://test:test@localhost:3306/finance_tracker_test";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.JWT_SECRET = "test-jwt-secret-key-32-characters-long";
process.env.CLERK_SECRET_KEY = "sk_test_1234567890abcdef1234567890abcdef12345678";
process.env.CLERK_PUBLISHABLE_KEY = "pk_test_1234567890abcdef1234567890abcdef12345678";

// Mock auth headers for testing
export const createAuthHeaders = (userId: string) => ({
  Authorization: `Bearer mock_token_${userId}`,
});

export const noAuthHeaders = () => ({});

// Test data factories
export const createTestUser = () => ({
  name: "Test User",
  email: "test@example.com", 
  password: "TestPass123!",
});

export const createTestEntity = () => ({
  name: "Test Entity",
});

export const createTestAccount = () => ({
  entityId: "test-entity-id",
  name: "Test Account",
  type: "savings",
  balance: "1000.00",
  annualNominalRate: "2.50",
  isSalaryAccount: false,
  overdraftLimit: "0.00",
});

export const createTestCreditCard = () => ({
  entityId: "test-entity-id",
  name: "Test Credit Card",
  description: "Test credit card description",
  limit: "5000.00",
  number: "1234567890123456",
  expiration: "2025-12-31T00:00:00.000Z",
  closingDay: 15,
  status: "active",
});

export const createTestLoan = () => ({
  entityId: "test-entity-id",
  name: "Test Loan",
  initialCapital: "10000.00",
  annualInterestRate: "5.25",
  installments: 60,
  remainingInstallments: 60,
  totalAnnualFinancedCost: "2500.00",
  amortizationStrategy: "french",
  currency: "USD",
  remainingCapital: "10000.00",
});

export const createTestIncome = () => ({
  name: "Test Income",
  amount: "5000.00",
  frequency: "monthly",
  isHourly: false,
  startDate: "2024-01-01T00:00:00.000Z",
  endDate: "2024-12-31T00:00:00.000Z",
});

export const createTestTransaction = () => ({
  fromAccountId: "test-from-account-id",
  toAccountId: "test-to-account-id",
  amount: "100.00",
  description: "Test transaction",
  transactionDate: "2024-01-15T00:00:00.000Z",
});

export const createTestCreditCardTransaction = () => ({
  creditCardId: "test-credit-card-id",
  amount: "50.00",
  description: "Test CC transaction",
  transactionDate: "2024-01-15T00:00:00.000Z",
  merchantName: "Test Merchant",
  category: "groceries",
});