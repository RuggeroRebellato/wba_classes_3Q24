/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pontos_gratis.json`.
 */
export type PontosGratis = {
  address: "Hw25VdJjpYKNVbB3KEchXL5NebR283fBGT9yCHaMqT8M";
  metadata: {
    name: "pontosGratis";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "createBusiness";
      discriminator: [151, 158, 148, 231, 53, 237, 97, 61];
      accounts: [
        {
          name: "pontosGratis";
          writable: true;
        },
        {
          name: "business";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "tokenName";
          type: "string";
        },
        {
          name: "tokenSymbol";
          type: "string";
        }
      ];
    },
    {
      name: "createTokenAccount";
      discriminator: [147, 241, 123, 100, 244, 132, 174, 118];
      accounts: [
        {
          name: "tokenAccount";
          writable: true;
          signer: true;
        },
        {
          name: "business";
          writable: true;
        },
        {
          name: "user";
          writable: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "createUser";
      discriminator: [108, 227, 130, 130, 252, 109, 75, 218];
      accounts: [
        {
          name: "pontosGratis";
          writable: true;
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "pontosGratis";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "issueTokens";
      discriminator: [40, 207, 145, 106, 249, 54, 23, 179];
      accounts: [
        {
          name: "business";
          writable: true;
        },
        {
          name: "tokenAccount";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
          relations: ["business"];
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "redeemTokens";
      discriminator: [246, 98, 134, 41, 152, 33, 120, 69];
      accounts: [
        {
          name: "tokenAccount";
          writable: true;
        },
        {
          name: "user";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "business";
      discriminator: [60, 203, 129, 133, 68, 183, 210, 177];
    },
    {
      name: "pontosGratis";
      discriminator: [88, 132, 187, 210, 144, 241, 76, 158];
    },
    {
      name: "tokenAccount";
      discriminator: [220, 131, 236, 16, 145, 206, 207, 54];
    },
    {
      name: "user";
      discriminator: [159, 117, 95, 227, 239, 151, 58, 236];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "insufficientTokenBalance";
      msg: "Insufficient token balance";
    },
    {
      code: 6001;
      name: "invalidTokenAmount";
      msg: "Invalid token amount";
    },
    {
      code: 6002;
      name: "unauthorized";
      msg: "Unauthorized operation";
    }
  ];
  types: [
    {
      name: "business";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "tokenName";
            type: "string";
          },
          {
            name: "tokenSymbol";
            type: "string";
          },
          {
            name: "tokenSupply";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "pontosGratis";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "businessesCount";
            type: "u64";
          },
          {
            name: "usersCount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "tokenAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "business";
            type: "pubkey";
          },
          {
            name: "balance";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "user";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "pontosBalance";
            type: "u64";
          }
        ];
      };
    }
  ];
};
