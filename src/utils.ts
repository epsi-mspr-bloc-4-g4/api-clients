import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLastIdCustomer = async () => {
  const lastCustomer = await prisma.customer.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  if (!lastCustomer) {
    return 0;
  }
  return lastCustomer.id;
};
