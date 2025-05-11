
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DashboardHeaderProps {
  displayName: string;
}

const DashboardHeader = ({ displayName }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div className="mb-4 md:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold">Family Dashboard</h1>
        <p className="text-gray-600">Welcome back, {displayName}</p>
      </div>
      <div>
        <Button 
          onClick={() => navigate("/search")} 
          className="w-full md:w-auto"
        >
          <Search className="mr-2 h-4 w-4" />
          Find Care Homes
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
