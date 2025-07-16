const { execSync } = require("child_process")

console.log("🚀 Setting up SaaS Intake Platform...")

try {
  console.log("📦 Installing dependencies...")
  execSync("pnpm install", { stdio: "inherit" })

  console.log("🗃️  Setting up database...")
  execSync("pnpm db:push", { stdio: "inherit" })
  execSync("pnpm db:generate", { stdio: "inherit" })

  console.log("✅ Setup complete!")
  console.log("")
  console.log("Next steps:")
  console.log("1. Copy .env.example to .env and fill in your environment variables")
  console.log('2. Run "pnpm dev" to start the development server')
  console.log("3. Visit http://localhost:3000 to see your application")
} catch (error) {
  console.error("❌ Setup failed:", error.message)
  process.exit(1)
}
