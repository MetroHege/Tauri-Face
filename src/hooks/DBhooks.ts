import { useEffect, useState } from "react";
import Loki from "lokijs";
import { Vote } from "@/types/localTypes";

const useDB = () => {
  const [db, setDB] = useState<Loki | null>(null);
  const [faceCollection, setFaceCollection] =
    useState<Loki.Collection<Float32Array> | null>(null);
  const [voteCollection, setVoteCollection] =
    useState<Loki.Collection<Vote> | null>(null);

  useEffect(() => {
    try {
      const dbInstance = new Loki("1.json", {
        persistenceMethod: "fs",
      });

      // load the database if it exists
      dbInstance.loadDatabase({}, () => {
        // collections
        // create or get the collection of faces
        const faces =
          dbInstance.getCollection<Float32Array>("faces") ||
          dbInstance.addCollection("faces");

        // create or get the collection of votes
        const votes =
          dbInstance.getCollection<Vote>("votes") ||
          dbInstance.addCollection("votes");

        setDB(dbInstance);
        setFaceCollection(faces);
        setVoteCollection(votes);
      });
    } catch (error) {
      console.error("useDB error", error);
    }
  }, []);

  const getAllFaces = () => {
    if (!faceCollection) {
      return [];
    }
    return faceCollection.find();
  };

  const getAllVotes = () => {
    if (!voteCollection) {
      return [];
    }
    return voteCollection.find();
  };

  const addFaces = (face: Float32Array) => {
    if (!db || !faceCollection) {
      return new Error("No database or collection");
    }
    const response = faceCollection.insert(face);
    db.saveDatabase();
    return response;
  };

  const addVotes = (vote: Vote) => {
    if (!db || !voteCollection) {
      throw new Error("No database or collection");
    }
    const response = voteCollection.insert(vote);
    db.saveDatabase();
    return response;
  };

  const deleteAllFromDB = () => {
    if (!db || !faceCollection || !voteCollection) {
      throw new Error("No database or collection");
    }
    faceCollection.clear();
    voteCollection.clear();
    db.saveDatabase();
  };

  return { addFaces, addVotes, getAllFaces, getAllVotes, deleteAllFromDB };
};

export { useDB };
