import { useParams } from "react-router-dom";

const Recommendations = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default Recommendations;
