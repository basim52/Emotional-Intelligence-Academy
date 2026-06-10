import { BookOpen, Brain, BookHeart, Heart, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navigation({ currentTab, setCurrentTab }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "course", label: "الدورة التدريبية", icon: BookOpen },
    { id: "assessment", label: "مقياس الذكاء العاطفي", icon: Brain },
    { id: "simulator", label: "محاكي المواقف (AI)", icon: SparklesIcon },
    { id: "diary", label: "مذكرات الوعي والتأمل", icon: BookHeart },
  ];

  function SparklesIcon(props: any) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={props.className}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 21l-.813-5.096L3 15l5.187-.813L9 9l.813 5.187L15 15l-5.187.813zM18 10.5l-.5 3-.5-3-3-.5 3-.5.5-3 .5 3 3 .5-3 .5zM19.043 4.5l-.218 1.3-.217-1.3-1.3-.218 1.3-.217.217-1.3.218 1.3 1.3.217-1.3.218z"
        />
      </svg>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#fffef9]/95 backdrop-blur-md border-b border-[#e0dcd2] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand area */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1e3b40] rounded-xl flex items-center justify-center text-white font-black shadow-md">
              EI
            </div>
            <div className="text-right">
              <h1 className="text-lg font-black text-[#1e3b40] leading-tight font-tajawal">كورسات الذكاء العاطفي</h1>
              <p className="text-[10px] text-[#d4a373] font-black tracking-widest uppercase font-mono">Emotional Intelligence Academy</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 relative ${
                    isActive
                      ? "bg-[#1e3b40] text-white shadow-md"
                      : "text-[#1e3b40] hover:bg-[#1e3b40]/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#d4a373]" : "text-[#1e3b40]/70"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop CTA action but discreet */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => {
                const el = document.getElementById("pricing");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                } else {
                  setCurrentTab("course");
                }
              }}
              className="bg-[#d4a373] text-white px-5 py-2.5 rounded-full text-xs font-black shadow-md hover:bg-[#c49363] transition-all"
            >
              انضم إلينا
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-[#1e3b40] hover:bg-[#1e3b40]/5 focus:outline-none transition-colors border border-gray-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#fffef9] border-t border-[#e0dcd2] px-3 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentTab(tab.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-right font-black text-sm transition-colors ${
                  isActive
                    ? "bg-[#1e3b40] text-white"
                    : "text-[#1e3b40] hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#d4a373]" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
