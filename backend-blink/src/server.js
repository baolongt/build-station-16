import express from "express";
import cors from "cors";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { createPostResponse } from "@solana/actions";

const DEFAULT_SOL_ADDRESS = Keypair.generate().publicKey;
const DEFAULT_SOL_AMOUNT = 1;
const connection = new Connection(clusterApiUrl("devnet"));

const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;

console.log(`Server is starting ${BASE_URL}`);

// Express app setup
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Encoding",
      "Accept-Encoding",
    ],
  })
);

// Routes
app.get("/actions.json", getActionsJson);

app.get("/api/actions/make", getMakeEscrow);
app.post("/api/actions/make", postMakeEscrow);
app.get("/api/actions/take", getTakeEscrow);
app.post("/api/actions/take", postTakeEscrow);

function handleError(res, err) {
  res.status(400).json({ error: err.message || "An unknown error occurred" });
}

// Route handlers
function getActionsJson(req, res) {
  const payload = {
    rules: [
      { pathPattern: "/*", apiPath: "/api/actions/*" },
      { pathPattern: "/api/actions/**", apiPath: "/api/actions/**" },
    ],
  };
  res.json(payload);
}

async function getMakeEscrow(req, res) {
  try {
    const { toPubkey } = validatedMakeQueryParams(req.query);
    const baseHref = `${BASE_URL}/api/actions/make?to=${toPubkey.toBase58()}`;

    const payload = {
      title: "Escrow Example - Make Escrow Assets",
      icon: "https://solana-actions.vercel.app/solana_devs.jpg",
      description: "Create an escrow account to sell assets",
      links: {
        actions: [
          {
            label: "Create order for sell 1 SOL for 100 USDC",
            href: `${baseHref}&amount=1&receive=100`,
          },
        ],
      },
    };

    res.json(payload);
  } catch (err) {
    handleError(res, err);
  }
}

async function postMakeEscrow(req, res) {
  try {
    const { amount, receive } = validatedMakeQueryParams(req.query);
    // calculate PDA for escrowed account
  } catch (err) {
    handleError(res, err);
  }
}

async function getTakeEscrow(req, res) {
  try {
    const baseHref = `${BASE_URL}/api/actions/take?to=${toPubkey.toBase58()}`;

    const payload = {
      title: "Escrow Example - Take Escrow Assets",
      icon: "https://solana-actions.vercel.app/solana_devs.jpg",
      description: "Buy assets from an escrow account",
      links: {
        actions: [
          {
            label: "Transfer 100 USDC for 1 SOL",
            // amount_take = receive
            href: `${baseHref}&amount_take=100`,
          },
        ],
      },
    };

    res.json(payload);
  } catch (err) {
    handleError(res, err);
  }
}

async function postTakeEscrow(req, res) {
  try {
    const { amount, toPubkey } = validatedMakeQueryParams(req.query);
    const { account } = req.body;

    if (!account) {
      throw new Error('Invalid "account" provided');
    }

    const fromPubkey = new PublicKey(account);
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0
    );

    if (amount * LAMPORTS_PER_SOL < minimumBalance) {
      throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const payload = await createPostResponse({
      fields: {
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
      // note: no additional signers are needed
      // signers: [],
    });

    res.json(payload);
  } catch (err) {
    res.status(400).json({ error: err.message || "An unknown error occurred" });
  }
}

function validatedTakeQueryParams(query) {
  let amount_take;
  try {
    if (query.amount_take) {
      amount_take = parseFloat(query.amount_take);
    }
    if (amount_take <= 0) throw new Error("amount_take is too small");
  } catch (err) {
    throw new Error("Invalid input query parameter: amount_take");
  }

  return { amount_take };
}

function validatedMakeQueryParams(query) {
  // make escrow amoutn token and receive token
  let amount;
  let receive;

  try {
    if (query.amount) {
      amount = parseFloat(query.amount);
    }
    if (amount <= 0) throw new Error("amount is too small");
  } catch (err) {
    throw new Error("Invalid input query parameter: amount");
  }

  if (query.receive) {
    try {
      receive = parseFloat(query.receive);
      if (receive <= 0) throw new Error("receive is too small");
    } catch (err) {
      throw new Error("Invalid input query parameter: receive");
    }
  }

  return { amount, receive };
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
