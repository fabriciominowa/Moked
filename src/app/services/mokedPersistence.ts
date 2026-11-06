import { MokedDatabaseSchema } from '@/types/moked';
import { createInitialMokedDatabase } from './mokedSeed';

const STORAGE_KEY = 'moked_crm_database_v1';
let memoryDb: MokedDatabaseSchema | null = null;

export class MokedPersistence {
  public static readDb(): MokedDatabaseSchema {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          memoryDb = JSON.parse(item) as MokedDatabaseSchema;
          return memoryDb;
        }
      } catch (err) {
        console.warn('Erro ao ler localStorage do Moked:', err);
      }
    }

    if (!memoryDb) {
      memoryDb = createInitialMokedDatabase();
      this.writeDb(memoryDb);
    }
    return memoryDb;
  }

  public static writeDb(nextDb: MokedDatabaseSchema): void {
    memoryDb = nextDb;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDb));
      } catch (err) {
        console.warn('Erro ao salvar no localStorage do Moked:', err);
      }
    }
  }

  public static updateDb<T>(mutator: (db: MokedDatabaseSchema) => T): T {
    const db = this.readDb();
    const result = mutator(db);
    this.writeDb(db);
    return result;
  }

  public static resetToSeed(): MokedDatabaseSchema {
    const seed = createInitialMokedDatabase();
    this.writeDb(seed);
    return seed;
  }
}
