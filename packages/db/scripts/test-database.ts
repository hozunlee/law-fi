import "dotenv/config";
import prisma from "../src/client";

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n");

  try {
    console.log("✅ Connected to database!");

    console.log("\n📝 Creating a test HealthCheck...");
    const newHealth = await prisma.healthCheck.create({
      data: {
        message: "Test message",
      },
    });
    console.log("✅ Created health check:", newHealth);

    console.log("\n📋 Fetching all health checks...");
    const allHealths = await prisma.healthCheck.findMany();
    console.log(`✅ Found ${allHealths.length} health check(s):`);
    allHealths.forEach((h) => {
      console.log(`   - ${h.message} (${h.createdAt})`);
    });

    console.log("\n🎉 All tests passed! Your database is working.\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
