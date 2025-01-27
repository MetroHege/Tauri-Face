import { useStore } from "@/stores/DBStore";
import { useLocation } from "react-router";

const Detected = () => {
  const { state } = useLocation();
  const { addFaces } = useStore();
  console.log("state", state);
  // store the descriptors in the database
  try {
    addFaces(state);
  } catch (error) {
    console.error("Error storing face descriptors:", error);
  }
  return (
    <div>
      <h1>Detected</h1>
    </div>
  );
};

export default Detected;
