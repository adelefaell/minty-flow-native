/**
 * Preset expense categories for quick setup.
 *
 * @remarks
 * These are default categories that users can use when setting up their account.
 */
export const ExpensePresets = [
  {
    id: "exp_groceries",
    name: "Groceries",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:shopping-basket",
    type: "expense",
    color: {
      name: "emerald",
      bgClass: "bg-emerald-500",
      textClass: "text-emerald-500",
      borderClass: "border-emerald-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "exp_transportation",
    name: "Transportation",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:car",
    type: "expense",
    color: {
      name: "blue",
      bgClass: "bg-blue-500",
      textClass: "text-blue-500",
      borderClass: "border-blue-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "exp_healthcare",
    name: "Healthcare",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:heart",
    type: "expense",
    color: {
      name: "red",
      bgClass: "bg-red-500",
      textClass: "text-red-500",
      borderClass: "border-red-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "exp_education",
    name: "Education",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:graduation-cap",
    type: "expense",
    color: {
      name: "purple",
      bgClass: "bg-purple-500",
      textClass: "text-purple-500",
      borderClass: "border-purple-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "exp_shopping",
    name: "Shopping",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:shopping-bag",
    type: "expense",
    color: {
      name: "pink",
      bgClass: "bg-pink-500",
      textClass: "text-pink-500",
      borderClass: "border-pink-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
]

/**
 * Preset income categories for quick setup.
 *
 * @remarks
 * These are default categories that users can use when setting up their account.
 */
export const IncomePresets = [
  {
    id: "inc_salary",
    name: "Salary",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:wallet",
    type: "income",
    color: {
      name: "green",
      bgClass: "bg-green-500",
      textClass: "text-green-500",
      borderClass: "border-green-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "inc_freelance",
    name: "Freelance",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:briefcase",
    type: "income",
    color: {
      name: "amber",
      bgClass: "bg-amber-500",
      textClass: "text-amber-500",
      borderClass: "border-amber-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "inc_investment",
    name: "Investment",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:trending-up",
    type: "income",
    color: {
      name: "teal",
      bgClass: "bg-teal-500",
      textClass: "text-teal-500",
      borderClass: "border-teal-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "inc_business",
    name: "Business",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:building",
    type: "income",
    color: {
      name: "indigo",
      bgClass: "bg-indigo-500",
      textClass: "text-indigo-500",
      borderClass: "border-indigo-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "inc_gift",
    name: "Gift",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:gift",
    type: "income",
    color: {
      name: "rose",
      bgClass: "bg-rose-500",
      textClass: "text-rose-500",
      borderClass: "border-rose-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
]

/**
 * Preset transfer categories for quick setup.
 *
 * @remarks
 * These are default categories that users can use when setting up their account.
 */
export const TransferPresets = [
  {
    id: "trf_savings",
    name: "Savings",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:piggy-bank",
    type: "transfer",
    color: {
      name: "emerald",
      bgClass: "bg-emerald-500",
      textClass: "text-emerald-500",
      borderClass: "border-emerald-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "trf_investment",
    name: "Investment",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:chart-line",
    type: "transfer",
    color: {
      name: "blue",
      bgClass: "bg-blue-500",
      textClass: "text-blue-500",
      borderClass: "border-blue-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "trf_retirement",
    name: "Retirement",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:clock",
    type: "transfer",
    color: {
      name: "purple",
      bgClass: "bg-purple-500",
      textClass: "text-purple-500",
      borderClass: "border-purple-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
  {
    id: "trf_debt_payment",
    name: "Debt Payment",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: "default",
    icon: "lucide:credit-card",
    type: "transfer",
    color: {
      name: "orange",
      bgClass: "bg-orange-500",
      textClass: "text-orange-500",
      borderClass: "border-orange-500",
    },
    transactionCount: 0,
    transactionTotal: {},
  },
]
