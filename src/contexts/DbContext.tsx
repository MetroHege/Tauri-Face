import { createContext, useEffect, useState } from "react";
import { useDB } from "../hooks/DBhooks";
import { Vote } from "@/types/localTypes";
import Loki from "lokijs";

type DbContextType = {
  db: Loki | null;
  addFaces: (doc: Float32Array) => Float32Array | undefined;
  getAllFaces: () => (Float32Array & LokiObj)[];
  deleteAllFromDB: () => void;
  addVotes: (vote: Vote) => Vote | undefined;
  getAllVotes: () => (Vote & LokiObj)[];
  faces: (Float32Array & LokiObj)[];
};

const DbContext = createContext<DbContextType | null>(null);

const DbProvider = ({ children }: { children: React.ReactNode }) => {
  const [faces, setFaces] = useState<(Float32Array & LokiObj)[]>([]);

  const { db, addFaces, getAllFaces, deleteAllFromDB, addVotes, getAllVotes } =
    useDB();

  useEffect(() => {
    setFaces(getAllFaces());
  }, []);

  console.log("faces context", faces);

  return (
    <DbContext.Provider
      value={{
        db,
        addFaces,
        getAllFaces,
        deleteAllFromDB,
        addVotes,
        getAllVotes,
        faces,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export { DbContext, DbProvider };
