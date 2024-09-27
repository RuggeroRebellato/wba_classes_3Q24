/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/wba_prereq.json`.
 */
export type WbaPrereq = {
  address: "WBAQSygkwMox2VuWKU133NxFrpDZUBdvSBeaBEue2Jq";
  metadata: {
    name: "wbaPrereq";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "clean";
      discriminator: [250, 191, 56, 128, 150, 251, 1, 103];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "prereq";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "complete";
      discriminator: [0, 77, 224, 147, 136, 25, 88, 76];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "prereq";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 101, 114, 101, 113];
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "github";
          type: "bytes";
        }
      ];
    },
    {
      name: "update";
      discriminator: [219, 200, 88, 176, 158, 63, 253, 127];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "prereq";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "github";
          type: "bytes";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "q2Prereq2024";
      discriminator: [210, 203, 168, 103, 251, 233, 204, 6];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidGithubAccount";
      msg: "Invalid Github account";
    }
  ];
  types: [
    {
      name: "q2Prereq2024";
      type: {
        kind: "struct";
        fields: [
          {
            name: "github";
            type: "bytes";
          },
          {
            name: "key";
            type: "pubkey";
          }
        ];
      };
    }
  ];
};
