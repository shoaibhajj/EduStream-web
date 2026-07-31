import { PrismaClient } from "../lib/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });



async function main() {
  // Upsert the single global payment config — safe to re-run
  await prisma.paymentConfig.upsert({
    where: { id: "global-payment-config" },
    update: {},
    create: {
      id: "global-payment-config",
      instructionsAr:
        "يرجى تحويل المبلغ عبر الوسيلة المناسبة وإرسال إثبات الدفع.",
      shamCashInstructionsAr:
        "امسح رمز QR عبر تطبيق شام كاش وأرسل إثبات الدفع عبر واتساب.",
    },
  });
  console.log("Seeded global payment config");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
