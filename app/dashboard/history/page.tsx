import Sidebar from "../../components/Sidebar";
import HistoryClient from "./HistoryClient";

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen bg-[#020817]">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <HistoryClient />
        </div>
      </main>
    </div>
  );
}
