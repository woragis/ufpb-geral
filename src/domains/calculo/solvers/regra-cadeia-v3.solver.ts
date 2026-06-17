import type { Solution } from "@/core/domain/problem";
import { fmtNum } from "../lib/format";
import type { RegraCadeiaData } from "../entities/types";

export function solveRegraCadeiaV3(
  d: RegraCadeiaData,
  problemaId: string,
): Solution | null {
  if (d.tipo !== "regra-cadeia-avancada") return null;
  const x0 = d.x0;

  switch (d.variante) {
    case "sin-quadrado": {
      const val = 2 * Math.sin(x0) * Math.cos(x0);
      const resposta = fmtNum(Math.round(val * 1000) / 1000);
      return {
        problemaId,
        respostaFinal: resposta,
        steps: [
          {
            ordem: 1,
            titulo: "Reescrever",
            explicacao: "sin²(x) = [sin(x)]² — usar cadeia com potência 2.",
            calculo: "h(x) = [sin(x)]²",
          },
          {
            ordem: 2,
            titulo: "Derivar",
            explicacao: "h' = 2 sin(x) cos(x).",
            calculo: `h'(${x0}) = ${resposta}`,
            resultado: resposta,
          },
        ],
      };
    }
    case "exp-quadrado": {
      const val = 2 * x0 * Math.exp(x0 * x0);
      const resposta = fmtNum(Math.round(val * 1000) / 1000);
      return {
        problemaId,
        respostaFinal: resposta,
        steps: [
          { ordem: 1, titulo: "Composição", explicacao: "u = x², f(u)=e^u.", calculo: "h' = e^(x²)·2x" },
          { ordem: 2, titulo: "Avaliar", explicacao: `x=${x0}`, calculo: `h'(${x0})=${resposta}`, resultado: resposta },
        ],
      };
    }
    case "ln-quadrado": {
      const inner = x0 * x0 + 1;
      const val = (2 * x0) / inner;
      const resposta = fmtNum(Math.round(val * 1000) / 1000);
      return {
        problemaId,
        respostaFinal: resposta,
        steps: [
          { ordem: 1, titulo: "Cadeia", explicacao: "ln(u) com u=x²+1.", calculo: "h' = (2x)/(x²+1)" },
          { ordem: 2, titulo: "Avaliar", explicacao: `x=${x0}`, calculo: `h'(${x0})=${resposta}`, resultado: resposta },
        ],
      };
    }
    case "sqrt-composta": {
      const inner = 1 + x0 * x0;
      const val = x0 / Math.sqrt(inner);
      const resposta = fmtNum(Math.round(val * 1000) / 1000);
      return {
        problemaId,
        respostaFinal: resposta,
        steps: [
          { ordem: 1, titulo: "Cadeia", explicacao: "√u com u=1+x².", calculo: "h' = x/√(1+x²)" },
          { ordem: 2, titulo: "Avaliar", explicacao: `x=${x0}`, calculo: `h'(${x0})=${resposta}`, resultado: resposta },
        ],
      };
    }
  }
}
