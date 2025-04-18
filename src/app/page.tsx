"use client";
import { useEffect, useState } from "react";
import ERPCard from "@/components/ERPCard";
import Footer from "@/components/Footer";
import { ERP } from "@/lib/types";
import Loading from "@/components/Loading";
// import ProgressBar from "@/components/ProgressBar";

async function getData() {
  const baseUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  const res: Response = await fetch(`${baseUrl}/api/erps`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch ERP Data");
  return res.json();
}

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [erps, setErps] = useState<ERP[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const lastVisitedTab = localStorage.getItem("selectedTab");
    if (lastVisitedTab) {
      setSelectedTab(lastVisitedTab);
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const erpData = await getData();
        setErps(erpData);
      } catch (error) {
        console.error("Error fetching ERP data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30 * 1 * 1000); // Number of minutes * 60 * 1000

    return () => clearInterval(interval);
  }, []);

  const filterData = (status: string) => {
    if (status === "pipeline") {
      return erps.filter((erp) => erp.status === "In Pipeline");
    } else if (status === "onboarded") {
      return erps.filter((erp) => erp.status === "Onboarded");
    } else if (status === "outsourcing") {
      return erps.filter((erp) => erp.status === "Outsourcing Contract");
    }
    return [];
  };

  const handleTabChange = (currentTab: string) => {
    if (currentTab === selectedTab) {
      setSelectedTab("");
    } else {
      setSelectedTab(currentTab);
    }
    localStorage.setItem("selectedTab", currentTab);
  };

  if (loading) {
    return <Loading />;
  }

  // const sheetLinks = [
  //   {
  //     name: "Rego",
  //     url: `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_OUTSOURCING_SHEET_ID}/pub?gid=1844175143&single=true&output=csv`,
  //     onlineLink:
  //       "https://docs.google.com/spreadsheets/d/1bskg7-Ly2MCLOaH0SPUMQh2DKGouHYAIlPEt4Zy1c-A/edit?gid=1844175143#gid=1844175143",
  //   },
  //   {
  //     name: "SGS",
  //     url: `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_OUTSOURCING_SHEET_ID}/pub?gid=976120039&single=true&output=csv`,
  //     onlineLink:
  //       "https://docs.google.com/spreadsheets/d/1bskg7-Ly2MCLOaH0SPUMQh2DKGouHYAIlPEt4Zy1c-A/edit?gid=976120039#gid=976120039",
  //   },
  //   {
  //     name: "Sodexo",
  //     url: `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_OUTSOURCING_SHEET_ID}/pub?gid=199610930&single=true&output=csv`,
  //     onlineLink:
  //       "https://docs.google.com/spreadsheets/d/1bskg7-Ly2MCLOaH0SPUMQh2DKGouHYAIlPEt4Zy1c-A/edit?gid=199610930#gid=199610930",
  //   },
  //   {
  //     name: "Safety_Outsourcing",
  //     url: `https://docs.google.com/spreadsheets/d/e/${process.env.NEXT_PUBLIC_OUTSOURCING_SHEET_ID}/pub?gid=528451996&single=true&output=csv`,
  //     onlineLink:
  //       "https://docs.google.com/spreadsheets/d/1bskg7-Ly2MCLOaH0SPUMQh2DKGouHYAIlPEt4Zy1c-A/edit?gid=528451996#gid=528451996",
  //   },
  // ];

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="mb-15">
        <h1 className="text-2xl md:text-4xl font-bold text-black mb-6">
          ERP / OUTSOURCING DASHBOARD
        </h1>

        {/* Responsive Tabs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            className={`text-lg md:text-2xl font-bold rounded p-2 ${
              selectedTab === "pipeline"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleTabChange("pipeline")}
          >
            ERP IN PIPELINE
          </button>

          <button
            className={`text-lg md:text-2xl font-bold rounded p-2 ${
              selectedTab === "onboarded"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleTabChange("onboarded")}
          >
            ERP ONBOARDED
          </button>

          <button
            className={`text-lg md:text-2xl font-bold rounded p-2 ${
              selectedTab === "outsourcing"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => handleTabChange("outsourcing")}
          >
            OUTSOURCING CONTRACT
          </button>
        </div>

        {/* Conditional Rendering: Show Progress Bars if no tab is selected */}
        {/* {selectedTab === "" ? (
          <div>
            {sheetLinks.map(({ name, url, onlineLink }) => (
              <a key={name} href={onlineLink} target="_blank" rel="noreferrer">
                <div className="mb-4">
                  <ProgressBar sheetName={name} csvUrl={url} />
                </div>
              </a>
            ))}
          </div>
        ) : ( */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterData(selectedTab).map((erp) => (
            <ERPCard key={erp.id} erp={erp} />
          ))}
        </div>
        {/* )} */}
      </div>
      <Footer />
    </div>
  );
}
