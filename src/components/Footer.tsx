import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';

export const Footer: React.FC = () => {
  const { portfolioState, updateProfile } = useEditor();
  const { profile } = portfolioState;

  return (
    <footer className="w-full bg-[#F6F6F6] mt-24 py-12">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-2 md:px-2 flex flex-col sm:flex-row items-center justify-between text-[13px] text-black/60 gap-4">
        <div className="flex items-center gap-1.5 lowercase">
          <span>©</span>
          <EditableText
            value={profile.copyrightYear}
            onChange={(val) => updateProfile({ copyrightYear: val })}
            label="Copyright Year"
          />
          <EditableText
            value={profile.fullName}
            onChange={(val) =>
              updateProfile({
                fullName: val,
                lowercaseName: val.toLowerCase(),
              })
            }
            label="Designer Name in Footer"
          />
          <span>, all rights reserved</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={`mailto:${profile.connect.email}`}
            className="hover:text-black transition-colors"
          >
            {profile.connect.email}
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-black transition-colors cursor-pointer"
          >
            ↑ back to top
          </button>
        </div>
      </div>
    </footer>
  );
};
