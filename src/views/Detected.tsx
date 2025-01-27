import { useStore } from "@/stores/DBStore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { PointerIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

const Detected = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { addFaces } = useStore();
  const [time, setTime] = useState(2);

  useEffect(() => {
    try {
      addFaces(state);
    } catch (error) {
      console.error(error);
    }

    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          navigate("/gesture/" + state.label);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 text-center text-xl leading-10">
      <h2 className="text-3xl text-center">{state.label}, prepare to vote</h2>
      <p>
        <ThumbsUpIcon className="inline" /> or{" "}
        <ThumbsDownIcon className="inline" /> to vote,
      </p>
      <p>
        <PointerIcon className="inline" /> to save
      </p>
      <p className="text-sm">In {time}s</p>
    </div>
  );
};

export default Detected;
