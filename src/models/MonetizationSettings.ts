import { Schema, models, model, type Document } from "mongoose";

export interface IMonetizationPackage {
  id: string;
  name: string;
  priceBRL: number;
  minutes: number;
  bonusStories: number;
  isPopular?: boolean;
}

export interface IMonetizationSettings extends Document {
  key: string;
  // Métricas Combinadas (Cálculo Exato)
  storyCreditsCost: number; // Ex: 2 créditos por história
  minutesPerCredit: number; // Ex: 2 minutos por crédito => 2 * 2 = 4 minutos exatos
  gameCreditsCost: number; // Ex: 1 crédito por jogo => 1 * 2 = 2 minutos exatos

  // Regras de Degustação para Aluno Novo
  newStudentTrialDays: number; // Ex: 3 dias grátis
  newStudentTrialStories: number; // Ex: 3 histórias gratuitas no período de teste
  newStudentTrialGames: number; // Ex: 3 jogos gratuitos no período de teste

  // Pacotes de Minutos
  packages: IMonetizationPackage[];
  updatedAt: Date;
}

export const DEFAULT_MONETIZATION_SETTINGS = {
  key: "default",
  storyCreditsCost: 2,
  minutesPerCredit: 2, // 2 créditos * 2 minutos = 4 minutos da cota por história
  gameCreditsCost: 1, // 1 crédito * 2 minutos = 2 minutos da cota por jogo
  newStudentTrialDays: 3, // 3 dias de acesso grátis para novo aluno
  newStudentTrialStories: 3, // 3 histórias grátis
  newStudentTrialGames: 3, // 3 jogos grátis
  packages: [
    {
      id: "pkg_120",
      name: "Pacote Descoberta",
      priceBRL: 15,
      minutes: 120,
      bonusStories: 2,
      isPopular: false,
    },
    {
      id: "pkg_240",
      name: "Pacote Imersão",
      priceBRL: 25,
      minutes: 240,
      bonusStories: 5,
      isPopular: true,
    },
    {
      id: "pkg_480",
      name: "Pacote Fluência",
      priceBRL: 40,
      minutes: 480,
      bonusStories: 12,
      isPopular: false,
    },
  ],
};

const PackageSchema = new Schema<IMonetizationPackage>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    priceBRL: { type: Number, required: true },
    minutes: { type: Number, required: true },
    bonusStories: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
  },
  { _id: false }
);

const MonetizationSettingsSchema = new Schema<IMonetizationSettings>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    storyCreditsCost: { type: Number, default: 2 },
    minutesPerCredit: { type: Number, default: 2 },
    gameCreditsCost: { type: Number, default: 1 },
    newStudentTrialDays: { type: Number, default: 3 },
    newStudentTrialStories: { type: Number, default: 3 },
    newStudentTrialGames: { type: Number, default: 3 },
    packages: { type: [PackageSchema], default: DEFAULT_MONETIZATION_SETTINGS.packages },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default models.MonetizationSettings ||
  model<IMonetizationSettings>("MonetizationSettings", MonetizationSettingsSchema);
