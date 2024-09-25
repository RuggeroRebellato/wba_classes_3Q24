import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PontosGratis } from "../target/types/pontos_gratis";

describe("pontos-gratis", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.PontosGratis as Program<PontosGratis>;

  require("./initialize")(program);
  require("./business")(program);
  require("./user")(program);
  require("./tokens")(program);
});
