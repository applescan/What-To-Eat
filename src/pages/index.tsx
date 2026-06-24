import HeroBanner from "components/Home/HeroBanner";
import Diets from "components/Home/Diets";

const Index: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <HeroBanner />
      <Diets />
    </div>
  );
};

export default Index;
