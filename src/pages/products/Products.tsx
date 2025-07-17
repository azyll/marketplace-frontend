import { useParams } from "react-router";

export default function Products() {
  const { slug } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Product: {slug}</h1>
      {/* You can fetch or filter your data based on slug here */}
    </div>
  );
}
