/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Assessment from "./components/Assessment";
import Simulator from "./components/Simulator";
import Journal from "./components/Journal";
import CoursePortal from "./components/CoursePortal";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("course");
  const [isEnrolled, setIsEnrolled] = useState<boolean>(() => {
    return localStorage.getItem("is_enrolled_ei") === "true";
  });
  const [viewPortalDirectly, setViewPortalDirectly] = useState<boolean>(true);

  const handleJoinCourse = () => {
    // Scrolls to the pricing element or triggers enroll behavior
    const pricingEl = document.getElementById("pricing");
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4] text-[#2d2d2d] flex flex-col font-sans" dir="rtl">
      {/* Top Header Navigation */}
      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Tab Content */}
      <main className="flex-grow">
        {currentTab === "course" && (
          isEnrolled && viewPortalDirectly ? (
            <div>
              <div className="bg-[#122427] text-[#faf8f5] px-4 py-2 border-b border-[#d4a373]/20 flex justify-between items-center text-xs">
                <span className="font-semibold">تنبيه: أنت الآن داخل صرح التعلم والدروس الـ 15 المكثفة 💡</span>
                <button 
                  onClick={() => setViewPortalDirectly(false)}
                  className="underline hover:text-[#d4a373] cursor-pointer transition-colors font-tajawal"
                >
                  عرض صفحة ميزات وتعريف الدورة ↩️
                </button>
              </div>
              <CoursePortal />
            </div>
          ) : (
            <div>
              {isEnrolled && (
                <div className="bg-[#1e3b40] text-white py-3.5 px-4 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md border-b border-[#d4a373]">
                  <span>أنت منتسب ومفعل رسمياً بالدورة!</span>
                  <button 
                    onClick={() => setViewPortalDirectly(true)}
                    className="underline hover:text-[#d4a373] font-black cursor-pointer ml-2 font-tajawal text-xs sm:text-sm"
                  >
                    انقر هنا للدخول المباشر لقاعة المنهج الدراسي المكثف ⬅️
                  </button>
                </div>
              )}
              <LandingPage 
                onJoinCourse={handleJoinCourse}
                onGoToSimulator={() => setCurrentTab("simulator")}
                onGoToAssessment={() => setCurrentTab("assessment")}
                onEnrollSuccess={() => {
                  localStorage.setItem("is_enrolled_ei", "true");
                  setIsEnrolled(true);
                  setViewPortalDirectly(true);
                }}
              />
            </div>
          )
        )}
        
        {currentTab === "assessment" && (
          <Assessment />
        )}

        {currentTab === "simulator" && (
          <Simulator />
        )}

        {currentTab === "diary" && (
          <Journal />
        )}
      </main>
    </div>
  );
}
