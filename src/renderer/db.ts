import {
  createRxDatabase,
  addRxPlugin,
  RxJsonSchema,
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBLocalDocumentsPlugin } from 'rxdb/plugins/local-documents';

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'; // big-donkey

import { v4 as uuidv4 } from 'uuid';

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBLocalDocumentsPlugin);

export const ARBEITSPLATZ_SCHEMA_LITERAL = {
  title: 'arbeitsplatzmessungen schema',
  description: 'describes a simple arbeitsplatzmessung',
  version: 0,
  keyCompression: false,
  primaryKey: 'id',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: '',
      maxLength: 100,
    },
    protokollnummer: {
      type: 'string',
    },
    protokolljahr: {
      type: 'number',
    },
    auftragsnummer: {
      type: 'string',
    },
    werkteil: {
      type: 'string',
    },
    werknummer: {
      type: 'string',
    },
    gebaeude: {
      type: 'string',
    },
    etage: {
      type: 'string',
    },
    abteilung: {
      type: 'string',
    },
    kostenstelle: {
      type: 'string',
    },
    arbeitsplatznummer: {
      type: 'string',
      maxLength: 256,
    },
    schichtmodell: {
      type: 'string',
    },
    arbeitskraefteproschicht: {
      type: 'string',
    },
    taetigkeitsbeschreibung1: {
      type: 'string',
    },
    taetigkeitsbeschreibung2: {
      type: 'string',
    },
    taetigkeitsbeschreibung3: {
      type: 'string',
    },
    messort1: {
      type: 'string',
    },
    messort2: {
      type: 'string',
    },
    messort3: {
      type: 'string',
    },
    kommentar1: {
      type: 'string',
    },
    kommentar2: {
      type: 'string',
    },
    kommentar3: {
      type: 'string',
    },
    messdatum: {
      type: 'number',
    },
    messgeraet: {
      type: 'string',
    },
    bearbeiter: {
      type: 'string',
    },

    lex: {
      type: 'string',
    },
    beurteilungszeit: {
      type: 'string',
    },
    lcpeak: {
      type: 'string',
    },
    genauigkeitsklasse: {
      type: 'string',
    },
    details: {
      type: 'string',
    },
    erstellt: {
      type: 'string',
    },
    geaendert: {
      type: 'string',
    },
    id: {
      type: 'string',
      maxLength: 36,
    },
    archiviert: {
      type: 'number',
      default: 0,
      multipleOf: 1,
      maximum: 1,
      minimum: 0,
    },
    createdAt: {
      type: 'number',
    },
    updatedAt: {
      type: 'number',
    },
  },
  required: ['arbeitsplatznummer', 'id', 'archiviert'],
  indexes: [
    ['arbeitsplatznummer', 'archiviert'], // <- this will create a compound-index for these two fields
    'arbeitsplatznummer',
    'archiviert',
  ],
} as const;

const schemaTyped = toTypedRxJsonSchema(ARBEITSPLATZ_SCHEMA_LITERAL);
export type RxHeroDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const HERO_SCHEMA: RxJsonSchema<RxHeroDocumentType> =
  ARBEITSPLATZ_SCHEMA_LITERAL;

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: '-',
  length: 2,
};

const randomName: string = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
}); // big_red_donkey

const shortName: string = uniqueNamesGenerator(customConfig);

function getRandomChoice<T>(choices: T[]): T {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}
const someNumbers = [1, 4, 6, 7, 8, 22, 14, 65];
const choicesWerk = ['W1', 'W2', 'W3'];
const choicesWerkteil = ['P20', 'P40', 'P60', 'P80'];
const choicesKostenstelle = ['K1', 'K2', 'K3', 'K4', 'K5'];
const choicesGebaeude = ['G1', 'G2', 'G3', 'G4', 'G5'];
const choicesAbteilung = ['A1', 'A2', 'A3', 'A4', 'A5'];
const choicesEtage = ['EG', 'UG', 'E1', 'E2', 'E3'];
const choicesTaetigkeit = ['Fußball', 'Tennis', 'Putzen', 'Tanzen'];
const choicesMessorte = ['Bar', 'Stadion', 'zu Hause', 'Auto'];
const choicesGenauigkeitsklasse = ['D', '1', '2', '3'];
const choicesMessgeraet = ['Ohr', 'Handy', 'Svantek'];
export function generateArbeitsplatz(): RxHeroDocumentType {
  return {
    id: uuidv4(),
    name: uniqueNamesGenerator(customConfig),
    werknummer: getRandomChoice(choicesWerk),
    gebaeude: getRandomChoice(choicesGebaeude),
    kostenstelle: getRandomChoice(choicesKostenstelle),
    abteilung: getRandomChoice(choicesAbteilung),
    etage: getRandomChoice(choicesEtage),
    arbeitsplatznummer: uniqueNamesGenerator(customConfig),
    archiviert: Math.random() > 0.95 ? 1 : 0,
    werkteil: getRandomChoice(choicesWerkteil),
    protokolljahr: getRandomChoice([2002, 2009, 2016, 2022, 2023, 2024]),
    protokollnummer: `A${getRandomChoice(someNumbers)}`,
    taetigkeitsbeschreibung1: getRandomChoice(choicesTaetigkeit),
    messort1: getRandomChoice(choicesMessorte),
    genauigkeitsklasse: getRandomChoice(choicesGenauigkeitsklasse),
    messdatum: new Date().getTime(),
    messgeraet: getRandomChoice(choicesMessgeraet),
    arbeitskraefteproschicht: `${getRandomChoice([1, 2, 3, 4, 5])}`,
    schichtmodell: `${getRandomChoice([8, 24])}`,
    lex: `${getRandomChoice([80, 130, 140, 150])}`,
    lcpeak: `${getRandomChoice([80, 130, 140, 150])}`,
    kommentar1: 'just my 2 cent',
    auftragsnummer: uuidv4(),
  };
}

export async function getDatabase(name: string, storage: any) {
  const db = await createRxDatabase({
    name,
    storage,
    ignoreDuplicate: true,
    localDocuments: true,
  });

  console.log('creating hero-collection..');
  await db.addCollections({
    arbeitsplatzmessungen: {
      schema: ARBEITSPLATZ_SCHEMA_LITERAL,
    },
  });
  db.arbeitsplatzmessungen.preInsert((data) => {
    const now = new Date().getTime();
    if (!data.createdAt) data.createdAt = now;
    if (!data.updatedAt) data.updatedAt = now;

    return data;
  }, true);

  db.arbeitsplatzmessungen.preSave((data, doc) => {
    data.updatedAt = new Date().getTime();
    return data;
  }, true);

  return db;
}
