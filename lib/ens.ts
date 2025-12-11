import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { normalize, namehash } from "viem/ens";

export interface ENSData {
  name: string;
  owner?: string;
  resolver?: string;
  address?: string;
  textRecords: Record<string, string>;
  contentHash?: string;
  avatar?: string;
  multichainAddresses: Record<string, string>;
}

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.llamarpc.com"),
});

const commonTextRecordKeys = [
  "avatar",
  "description",
  "url",
  "email",
  "keywords",
  "com.github",
  "com.twitter",
  "com.discord",
  "org.telegram",
  "com.reddit",
  "notice",
  "vnd.twitter",
  "vnd.github",
];

const multichainKeys = [
  "BTC",
  "LTC",
  "DOGE",
  "SOL",
  "MATIC",
  "AVAX",
  "ATOM",
  "DOT",
  "TRX",
];

export async function fetchENSData(ensName: string): Promise<ENSData> {
  const fullName = `${ensName}.eth`;
  const normalizedName = normalize(fullName);
  
  const data: ENSData = {
    name: normalizedName,
    textRecords: {},
    multichainAddresses: {},
  };

  // Get address
  try {
    const address = await publicClient.getEnsAddress({
      name: normalizedName,
    });
    if (address) {
      data.address = address;
    }
  } catch (e) {
    console.error("Error fetching address:", e);
  }

  // Get resolver
  try {
    const resolver = await publicClient.getEnsResolver({
      name: normalizedName,
    });
    if (resolver) {
      data.resolver = resolver;
    }
  } catch (e) {
    console.error("Error fetching resolver:", e);
  }

  // Get owner from registry
  try {
    const node = namehash(normalizedName);
    const registryAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" as `0x${string}`;
    const owner = await publicClient.readContract({
      address: registryAddress,
      abi: [
        {
          inputs: [{ name: "node", type: "bytes32" }],
          name: "owner",
          outputs: [{ name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "owner",
      args: [node],
    });
    if (owner && owner !== "0x0000000000000000000000000000000000000000") {
      data.owner = owner;
    }
  } catch (e) {
    console.error("Error fetching owner:", e);
  }

  // Get text records
  if (data.resolver) {
    for (const key of commonTextRecordKeys) {
      try {
        const value = await publicClient.getEnsText({
          name: normalizedName,
          key,
        });
        if (value) {
          data.textRecords[key] = value;
        }
      } catch (e) {
        // Continue if text record doesn't exist
      }
    }

    // Get avatar
    try {
      const avatar = await publicClient.getEnsAvatar({
        name: normalizedName,
      });
      if (avatar) {
        data.avatar = avatar;
        data.textRecords.avatar = avatar;
      }
    } catch (e) {
      // Avatar might not exist
    }

    // Get multichain addresses
    for (const chain of multichainKeys) {
      try {
        const address = await publicClient.getEnsText({
          name: normalizedName,
          key: `crypto.${chain}.address`,
        });
        if (address) {
          data.multichainAddresses[chain] = address;
        }
      } catch (e) {
        // Continue if multichain address doesn't exist
      }
    }

    // Get content hash
    try {
      const node = namehash(normalizedName);
      const contentHash = await publicClient.readContract({
        address: data.resolver as `0x${string}`,
        abi: [
          {
            inputs: [{ name: "node", type: "bytes32" }],
            name: "contenthash",
            outputs: [{ name: "", type: "bytes" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "contenthash",
        args: [node],
      });
      if (contentHash && contentHash !== "0x") {
        data.contentHash = contentHash;
      }
    } catch (e) {
      // Content hash might not exist
    }
  }

  return data;
}

