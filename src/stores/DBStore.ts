import Loki from "lokijs";
import { Vote } from "@/types/localTypes";
import { create } from "zustand";

type DBState = {
  db: Loki | null;
  facesCollection: Collection<Float32Array> | null;
  votesCollection: Collection<Vote> | null;
  isReady: boolean;
  faces: (Float32Array & LokiObj)[];
  votes: (Vote & LokiObj)[];
};

type DBStore = DBState & {
  init: () => Promise<void>;
  addFaces: (face: Float32Array) => Float32Array | undefined;
  addVotes: (vote: Vote) => Vote | undefined;
  deleteAllFromDB: () => void;
};

export const useStore = create<DBStore>((set, get) => ({
  db: null,
  facesCollection: null,
  votesCollection: null,
  isReady: false,
  faces: [],
  votes: [],

  init: () => {
    return new Promise((resolve, reject) => {
      const db = new Loki("1.json", {
        autoload: true,
        autoloadCallback: () => {
          const facesCollection =
            db.getCollection("faces") || db.addCollection("faces");
          const votesCollection =
            db.getCollection("votes") || db.addCollection("votes");
          set({
            db,
            facesCollection,
            votesCollection,
            isReady: true,
            faces: facesCollection.find(),
            votes: votesCollection.find(),
          });
          resolve();
        },
        autosave: true,
      });
    });
  },
  addFaces: (face) => {
    const result = get().facesCollection?.insert(face);
    set({ faces: get().facesCollection?.find() || [] });
    return result;
  },
  addVotes: (vote) => {
    const result = get().votesCollection?.insert(vote);
    set({ votes: get().votesCollection?.find() || [] });
    return result;
  },
  deleteAllFromDB: () => {
    get().facesCollection?.clear();
    get().votesCollection?.clear();
    set({ faces: [], votes: [] });
  },
}));
