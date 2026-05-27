import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import readline from "node:readline";

function parseEnvFile(contents: string): Record<string, string> {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce<Record<string, string>>((env, line) => {
      const [key, ...rest] = line.split("=");
      const value = rest.join("=").trim();
      env[key] = value.replace(/^"|"$/g, "");
      return env;
    }, {});
}

function loadEnvFile(fileName = ".env.local") {
  try {
    const envPath = resolve(process.cwd(), fileName);
    const contents = readFileSync(envPath, "utf8");
    const parsed = parseEnvFile(contents);
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    // Ignore missing .env.local if env vars are already provided externally.
  }
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function promptHidden(promptText: string) {
  if (!process.stdin.isTTY) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>((resolve) => {
      rl.question(promptText, (value) => {
        rl.close();
        resolve(value);
      });
    });
    return answer;
  }

  return new Promise<string>((resolve, reject) => {
    let password = "";

    const onData = (chunk: Buffer) => {
      const char = chunk.toString("utf8");
      if (char === "\r" || char === "\n") {
        process.stdout.write("\n");
        process.stdin.setRawMode(false);
        process.stdin.removeListener("data", onData);
        resolve(password);
        return;
      }

      if (char === "\u0003") {
        process.stdout.write("\n");
        process.stdin.setRawMode(false);
        process.stdin.removeListener("data", onData);
        reject(new Error("Input cancelled"));
        return;
      }

      if (char === "\u0008" || char === "\u007f") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\u001b[2K\u001b[0G" + promptText + "" + "*".repeat(password.length));
        }
        return;
      }

      password += char;
      process.stdout.write("*");
    };

    process.stdout.write(promptText);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}

async function run() {
  loadEnvFile();

  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/reset-password.ts <email>");
    process.exit(1);
  }

  if (!validateEmail(email)) {
    console.error("Error: Invalid email address.");
    process.exit(1);
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      "Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local or environment.",
    );
    process.exit(1);
  }

  try {
    const password = await promptHidden("New password: ");
    if (!password) {
      console.error("Error: Password cannot be empty.");
      process.exit(1);
    }
    const confirm = await promptHidden("Confirm password: ");
    if (password !== confirm) {
      console.error("Error: Passwords do not match.");
      process.exit(1);
    }

    const baseUrl = SUPABASE_URL.replace(/\/$/, "");
    const listResp = await fetch(
      `${baseUrl}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
      },
    );

    if (!listResp.ok) {
      const body = await listResp.text();
      throw new Error(`Failed to fetch user list: ${listResp.status} ${body}`);
    }

    const listBody = await listResp.json();
    const users = Array.isArray(listBody) ? listBody : listBody?.users;
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error(`No user found with email ${email}`);
    }

    const user = users[0];
    if (!user?.id) {
      throw new Error(`Could not determine user id for email ${email}`);
    }

    const updateResp = await fetch(`${baseUrl}/auth/v1/admin/users/${encodeURIComponent(user.id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!updateResp.ok) {
      const body = await updateResp.text();
      throw new Error(`Failed to update password: ${updateResp.status} ${body}`);
    }

    console.log(`Password reset successful for ${email}`);
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

run();
