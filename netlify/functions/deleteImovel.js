import fs from "fs";
import path from "path";

export async function handler(event) {
  if (event.httpMethod !== "DELETE") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  const { id } = JSON.parse(event.body);
  const filePath = path.resolve("public", "imoveis.json");
  let dados = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  dados = dados.filter((imovel) => imovel.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Imóvel deletado com sucesso" }),
  };
}
