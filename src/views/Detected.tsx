import { useLocation } from "react-router";

const Detected = () => {
  const { state } = useLocation();
  console.log("state", state);
  // store the descriptors in the database

  return (
    <div>
      <h1>Detected</h1>
    </div>
  );
};

export default Detected;
