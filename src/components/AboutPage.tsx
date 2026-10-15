import React from 'react';
import { useEditor } from '../context/EditorContext';
import { EditableText } from './EditableText';
import { DropzoneBox } from './DropzoneBox';
import { Camera, Plus, Trash2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const {
    portfolioState,
    updateProfile,
    isEditMode,
    isPreviewMode,
    openImageEditor,
  } = useEditor();

  const { profile } = portfolioState;

  return (
    <main className="w-full max-w-[1440px] mx-auto px-2 sm:px-2 md:px-2 pt-[70px] sm:pt-[90px] md:pt-[110px] pb-24 sm:pb-32 animate-fadeIn">
      {/* Asymmetric Editorial Grid inspired by reference portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-start">
        {/* Left Column (Main Statement, Date/Location, Structured Metadata) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          {/* 1. Large Bold Bio Statement */}
          <section>
            <h2
              className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[38px] font-normal tracking-[-0.025em] leading-[1.12] text-black"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              <EditableText
                value={profile.aboutBio}
                multiline
                onChange={(val) => updateProfile({ aboutBio: val })}
                label="Biography narrative"
              />
            </h2>
          </section>

          {/* 2. Structured Metadata Columns (Education & Connect) */}
          <section className="mt-14 sm:mt-20 md:mt-24 pt-8 sm:pt-10 border-t border-black/[0.08]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-14 text-[13px] sm:text-[14px]">
              {/* Education */}
              <div className="space-y-3">
                <h3 className="font-medium text-black lowercase tracking-tight">
                  education
                </h3>
                <ul className="space-y-1.5 text-black/70">
                  {profile.education.map((edu, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between group text-[12px] sm:text-[13px] leading-relaxed"
                    >
                      <EditableText
                        value={edu}
                        onChange={(val) => {
                          const copy = [...profile.education];
                          copy[idx] = val;
                          updateProfile({ education: copy });
                        }}
                        label="Education institution"
                      />
                      {isEditMode && !isPreviewMode && (
                        <button
                          type="button"
                          onClick={() => {
                            const copy = profile.education.filter((_, i) => i !== idx);
                            updateProfile({ education: copy });
                          }}
                          className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 p-0.5 transition-opacity"
                          title="Remove"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {isEditMode && !isPreviewMode && (
                  <button
                    type="button"
                    onClick={() =>
                      updateProfile({
                        education: [...profile.education, 'New University / Degree'],
                      })
                    }
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" /> Add education
                  </button>
                )}
              </div>

              {/* Connect */}
              <div className="space-y-3">
                <h3 className="font-medium text-black lowercase tracking-tight">
                  connect
                </h3>
                <div className="space-y-1.5 text-black/70 text-[12px] sm:text-[13px] leading-relaxed">
                  <div>
                    <a
                      href={`mailto:${profile.connect.email}`}
                      className="hover:text-black transition-colors underline-offset-2 hover:underline"
                    >
                      <EditableText
                        value={profile.connect.email}
                        onChange={(val) =>
                          updateProfile({
                            connect: { ...profile.connect, email: val },
                          })
                        }
                        label="Contact Email"
                      />
                    </a>
                  </div>
                  <div>
                    <EditableText
                      value={profile.connect.phone}
                      onChange={(val) =>
                        updateProfile({
                          connect: { ...profile.connect, phone: val },
                        })
                      }
                      label="Contact Phone"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Designer Studio Portrait) */}
        <div className="lg:col-span-5 xl:col-span-4 w-full flex flex-col items-center lg:items-end">
          <div className="w-full max-w-[380px] lg:max-w-[420px] sticky top-20">
            <DropzoneBox
              imageSrc={profile.portraitImage}
              alt={profile.portraitAlt}
              label="Designer Studio Portrait"
              aspectClass="aspect-[3/4]"
              backgroundColor="#F2F2F2"
              zoom={profile.portraitZoom}
              positionX={profile.portraitPositionX}
              positionY={profile.portraitPositionY}
              objectFit="cover"
              className="shadow-2xs"
              onImageDrop={(dataUrl) => {
                updateProfile({ portraitImage: dataUrl });
              }}
            >
              {isEditMode && !isPreviewMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageEditor({
                      id: 'portrait-image',
                      label: 'Designer Studio Portrait',
                      src: profile.portraitImage,
                      alt: profile.portraitAlt,
                      zoom: profile.portraitZoom,
                      positionX: profile.portraitPositionX,
                      positionY: profile.portraitPositionY,
                      onSave: (updated) => {
                        updateProfile({
                          portraitImage: updated.src,
                          portraitAlt: updated.alt,
                          portraitZoom: updated.zoom,
                          portraitPositionX: updated.positionX,
                          portraitPositionY: updated.positionY,
                        });
                      },
                    });
                  }}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm border border-black/10 text-xs font-medium text-black shadow-sm z-10 hover:bg-white"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>
              )}
            </DropzoneBox>

            {/* Subtle caption beneath portrait */}
            <div className="mt-2 text-right">
              <span className="text-[10px] text-black/30 font-mono tracking-wider lowercase">
                {profile.lowercaseName || profile.fullName.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
