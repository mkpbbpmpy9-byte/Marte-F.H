import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import { Edit3, Check, Layers } from 'lucide-react';

interface NavigationHeaderProps {
  currentTab: 'work' | 'about';
  isProjectPage?: boolean;
  onSelectTab: (tab: 'work' | 'about') => void;
  onGoHome: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentTab,
  isProjectPage = false,
  onSelectTab,
  onGoHome,
}) => {
  const {
    isAllowedToEdit,
    isEditMode,
    isPreviewMode,
    portfolioState,
    updateProfile,
    toggleEditMode,
    openProjectManager,
  } = useEditor();

  const { profile } = portfolioState;

  return (
    <header className="sticky top-0 z-40 w-full bg-transparent transition-all pt-2 pb-2">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-2 md:px-2 flex items-baseline justify-between bg-transparent">
        {/* Left: Designer Name (Matches homepage size across all pages) */}
        <div className="flex items-baseline">
          <h1
            onClick={onGoHome}
            className="cursor-pointer text-black font-normal lowercase hover:opacity-80 transition-all text-[32px] sm:text-[38px] md:text-[40px] tracking-[-0.02em] leading-none"
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            <EditableText
              value={profile.lowercaseName || profile.fullName.toLowerCase()}
              onChange={(val) =>
                updateProfile({
                  lowercaseName: val,
                  fullName: val,
                })
              }
              label="Designer Name"
            />
          </h1>
        </div>

        {/* Right: work & about navigation matching reference screenshot */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav
            className="flex items-center gap-3 sm:gap-4 text-[13px] sm:text-[14px] lowercase tracking-normal"
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            <button
              type="button"
              onClick={() => onSelectTab('work')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'work'
                  ? 'text-black font-normal'
                  : 'text-black/35 hover:text-black font-normal'
              }`}
            >
              <EditableText
                value={profile.navWorkLabel}
                onChange={(val) => updateProfile({ navWorkLabel: val })}
                label="Work Nav Label"
              />
            </button>

            <button
              type="button"
              onClick={() => onSelectTab('about')}
              className={`transition-colors cursor-pointer ${
                currentTab === 'about'
                  ? 'text-black font-normal'
                  : 'text-black/35 hover:text-black font-normal'
              }`}
            >
              <EditableText
                value={profile.navAboutLabel}
                onChange={(val) => updateProfile({ navAboutLabel: val })}
                label="About Nav Label"
              />
            </button>
          </nav>

          {/* Minimal Edit Mode activation trigger - ONLY rendered in preview window for the owner */}
          {isAllowedToEdit && (
            <div className="flex items-center gap-1.5 pl-2">
              {isEditMode && !isPreviewMode && (
                <button
                  type="button"
                  onClick={openProjectManager}
                  title="Manage & Reorder Projects"
                  className="hidden sm:flex items-center gap-1 px-2 py-0.5 text-[11px] border border-black/20 text-black hover:border-black transition-colors"
                >
                  <Layers className="w-3 h-3" />
                  <span>Projects</span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleEditMode}
                title={isEditMode ? 'Exit Edit Mode' : 'Enter Visual Edit Mode'}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-normal transition-all ${
                  isEditMode
                    ? 'bg-black text-white hover:bg-black/85 shadow-sm'
                    : 'bg-black/5 hover:bg-black/10 text-black/70 hover:text-black border border-black/10'
                }`}
              >
                {isEditMode ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Editing</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3 h-3 text-black/60" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
