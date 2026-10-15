import React from 'react';
import { useEditor } from '../context/EditorContext';
import {
  ProjectData,
  ProjectChapter,
  ProjectGalleryItem,
  ContentBlock,
} from '../data/defaultPortfolioData';
import { EditableText } from './EditableText';
import { DropzoneBox } from './DropzoneBox';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Palette,
  Image as ImageIcon,
  Columns,
  Type,
  Layout,
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
  onNavigateProject: (nextId: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  onBack,
  onNavigateProject,
}) => {
  const {
    portfolioState,
    isEditMode,
    isPreviewMode,
    updateProject,
    openImageEditor,
  } = useEditor();

  const { projects } = portfolioState;
  const projectIndex = projects.findIndex((p) => p.id === projectId);
  const project = projects[projectIndex];

  if (!project) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-20 text-center">
        <h2 className="text-xl mb-4">Project not found</h2>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-black text-white text-xs"
        >
          Return to overview
        </button>
      </div>
    );
  }

  const prevProject =
    projectIndex > 0 ? projects[projectIndex - 1] : projects[projects.length - 1];
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : projects[0];

  const handleUpdate = (updater: (prev: ProjectData) => ProjectData) => {
    updateProject(project.id, updater);
  };

  return (
    <article className="w-full bg-white text-black animate-fadeIn">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-2 md:px-2">
        {/* 1. PROJECT TITLE
            Positioned on the left side below navigation with generous whitespace,
            matching exact reference screenshot (Unlocking / Personalised Nutrition)
        */}
        <section className="pt-[80px] sm:pt-[100px] md:pt-[115px]">
          <h1
            className="text-[36px] sm:text-[44px] md:text-[48px] font-normal tracking-[-0.02em] leading-[1.02] text-black max-w-3xl"
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            {project.pageTitleLines.map((line, idx) => (
              <div key={idx} className="block">
                <EditableText
                  value={line}
                  onChange={(val) => {
                    handleUpdate((prev) => {
                      const copy = [...prev.pageTitleLines];
                      copy[idx] = val;
                      return { ...prev, pageTitleLines: copy };
                    });
                  }}
                  label={`Title line ${idx + 1}`}
                />
              </div>
            ))}
          </h1>

          {isEditMode && !isPreviewMode && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    pageTitleLines: [...prev.pageTitleLines, 'Additional Title Line'],
                  }));
                }}
                className="text-[11px] text-blue-600 hover:underline"
              >
                + Add title line
              </button>
              {project.pageTitleLines.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate((prev) => ({
                      ...prev,
                      pageTitleLines: prev.pageTitleLines.slice(0, -1),
                    }));
                  }}
                  className="text-[11px] text-red-500 hover:underline"
                >
                  - Remove line
                </button>
              )}
            </div>
          )}
        </section>

        {/* 2. HORIZONTAL INFORMATION SECTION
            Directly follows the bottom of the heading, matching project cover layout:
            Left side: Optional project details, awards, collaborators, or logos
            Right side: Project logo, category, year, or additional information
        */}
        <section className="mt-2.5 sm:mt-3 md:mt-3.5 pb-2.5 sm:pb-3 flex items-start justify-between w-full">
          {/* Left Side: Optional Award / Collaborator Details */}
          <div className="flex items-start gap-2.5 sm:gap-3 text-left">
            {/* Award Logo or Custom Icon */}
            {project.headerMeta.awardBadgeLogo ? (
              <div className="relative group shrink-0">
                <img
                  src={project.headerMeta.awardBadgeLogo}
                  alt="Award"
                  className="h-7 sm:h-8 object-contain"
                />
                {isEditMode && !isPreviewMode && (
                  <button
                    type="button"
                    onClick={() =>
                      openImageEditor({
                        id: `award-logo-${project.id}`,
                        label: 'Award Logo',
                        src: project.headerMeta.awardBadgeLogo || '',
                        alt: 'Award Logo',
                        onSave: (up) => {
                          handleUpdate((prev) => ({
                            ...prev,
                            headerMeta: {
                              ...prev.headerMeta,
                              awardBadgeLogo: up.src,
                            },
                          }));
                        },
                      })
                    }
                    className="absolute -top-1 -right-1 p-0.5 bg-white border border-black/20 text-[9px]"
                  >
                    edit
                  </button>
                )}
              </div>
            ) : isEditMode && !isPreviewMode ? (
              <button
                type="button"
                onClick={() =>
                  openImageEditor({
                    id: `award-logo-${project.id}`,
                    label: 'Award Logo',
                    src: '',
                    alt: 'Award Logo',
                    onSave: (up) => {
                      handleUpdate((prev) => ({
                        ...prev,
                        headerMeta: {
                          ...prev.headerMeta,
                          awardBadgeLogo: up.src,
                        },
                      }));
                    },
                  })
                }
                className="text-[10px] text-black/40 hover:text-black border border-dashed border-black/20 px-1 py-0.5"
              >
                + award logo
              </button>
            ) : null}

            {/* Award / Detail text lines */}
            {project.headerMeta.awardLines && project.headerMeta.awardLines.length > 0 ? (
              <div
                className="text-[12px] sm:text-[13px] md:text-[14px] leading-[16px] sm:leading-[18px] md:leading-[19px] text-black font-normal"
                style={{ fontFamily: 'var(--font-primary)' }}
              >
                {project.headerMeta.awardLines.map((al, idx) => (
                  <div key={idx} className="group/line flex items-center gap-1">
                    <EditableText
                      value={al}
                      onChange={(val) => {
                        handleUpdate((prev) => {
                          const lines = [...(prev.headerMeta.awardLines || [])];
                          lines[idx] = val;
                          return {
                            ...prev,
                            headerMeta: { ...prev.headerMeta, awardLines: lines },
                          };
                        });
                      }}
                      label="Detail line"
                    />
                    {isEditMode && !isPreviewMode && (
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdate((prev) => {
                            const lines = (prev.headerMeta.awardLines || []).filter((_, i) => i !== idx);
                            return {
                              ...prev,
                              headerMeta: { ...prev.headerMeta, awardLines: lines },
                            };
                          });
                        }}
                        className="opacity-0 group-hover/line:opacity-100 text-red-500 hover:text-red-700 text-[10px] px-0.5"
                        title="Remove line"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : isEditMode && !isPreviewMode ? (
              <button
                type="button"
                onClick={() => {
                  handleUpdate((prev) => ({
                    ...prev,
                    headerMeta: {
                      ...prev.headerMeta,
                      awardLines: ['Project Details'],
                    },
                  }));
                }}
                className="text-[10px] text-black/40 hover:text-black underline"
              >
                + add detail text
              </button>
            ) : null}
          </div>

          {/* Right Side: Project Logo & Context lines */}
          <div className="flex flex-col items-end text-right space-y-1">
            {/* Project Logo Image or Text */}
            {project.headerMeta.brandLogoUrl ? (
              <div className="relative group">
                <img
                  src={project.headerMeta.brandLogoUrl}
                  alt="Project Logo"
                  className="h-6 sm:h-7 object-contain ml-auto"
                />
                {isEditMode && !isPreviewMode && (
                  <button
                    type="button"
                    onClick={() =>
                      openImageEditor({
                        id: `brand-logo-${project.id}`,
                        label: 'Project Logo',
                        src: project.headerMeta.brandLogoUrl || '',
                        alt: 'Project Logo',
                        onSave: (up) => {
                          handleUpdate((prev) => ({
                            ...prev,
                            headerMeta: {
                              ...prev.headerMeta,
                              brandLogoUrl: up.src,
                            },
                          }));
                        },
                      })
                    }
                    className="absolute -top-1 -right-1 p-0.5 bg-white border border-black/20 text-[9px]"
                  >
                    edit
                  </button>
                )}
              </div>
            ) : project.headerMeta.brandLogoText ? (
              <div
                className="text-[13px] sm:text-[14px] md:text-[15px] font-medium text-black lowercase tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-primary)' }}
              >
                <EditableText
                  value={project.headerMeta.brandLogoText}
                  onChange={(val) =>
                    handleUpdate((prev) => ({
                      ...prev,
                      headerMeta: {
                        ...prev.headerMeta,
                        brandLogoText: val,
                      },
                    }))
                  }
                  label="Project Logo Text"
                />
              </div>
            ) : isEditMode && !isPreviewMode ? (
              <button
                type="button"
                onClick={() =>
                  openImageEditor({
                    id: `brand-logo-${project.id}`,
                    label: 'Project Logo',
                    src: '',
                    alt: 'Project Logo',
                    onSave: (up) => {
                      handleUpdate((prev) => ({
                        ...prev,
                        headerMeta: {
                          ...prev.headerMeta,
                          brandLogoUrl: up.src,
                        },
                      }));
                    },
                  })
                }
                className="text-[10px] text-black/40 hover:text-black border border-dashed border-black/20 px-1 py-0.5"
              >
                + project logo
              </button>
            ) : null}

            {/* Context Lines */}
            <div
              className="text-[12px] sm:text-[13px] md:text-[14px] leading-[16px] sm:leading-[18px] md:leading-[19px] text-black font-normal"
              style={{ fontFamily: 'var(--font-primary)' }}
            >
              {project.headerMeta.contextLines.map((cl, idx) => (
                <div key={idx}>
                  <EditableText
                    value={cl}
                    onChange={(val) => {
                      handleUpdate((prev) => {
                        const lines = [...prev.headerMeta.contextLines];
                        lines[idx] = val;
                        return {
                          ...prev,
                          headerMeta: { ...prev.headerMeta, contextLines: lines },
                        };
                      });
                    }}
                    label="Context line"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. MAIN PROJECT HERO IMAGE
            Directly below the project information, stretching almost the entire
            width of the page with narrow margins (px-2 matching reference 1005px on 1024px canvas),
            aspect ratio ~1005/480, supporting drag-and-drop & empty box
        */}
        <section className="mt-1 sm:mt-1.5 w-full">
          <DropzoneBox
            imageSrc={project.heroImage.src}
            alt={project.heroImage.alt || project.hoverTitle}
            label={`${project.hoverTitle} Hero Image`}
            aspectClass="aspect-[1005/480]"
            backgroundColor={project.heroImage.backgroundColor || '#FDCB18'}
            zoom={project.heroImage.zoom}
            positionX={project.heroImage.positionX}
            positionY={project.heroImage.positionY}
            objectFit="cover"
            onImageDrop={(dataUrl) => {
              handleUpdate((prev) => ({
                ...prev,
                heroImage: {
                  ...prev.heroImage,
                  src: dataUrl,
                },
              }));
            }}
          >
            {isEditMode && !isPreviewMode && (
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 border border-black/10 shadow-sm">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageEditor({
                      id: `hero-${project.id}`,
                      label: `${project.hoverTitle} Hero Image`,
                      src: project.heroImage.src,
                      alt: project.heroImage.alt,
                      zoom: project.heroImage.zoom,
                      positionX: project.heroImage.positionX,
                      positionY: project.heroImage.positionY,
                      onSave: (updated) => {
                        handleUpdate((prev) => ({
                          ...prev,
                          heroImage: {
                            ...prev.heroImage,
                            src: updated.src,
                            alt: updated.alt,
                            zoom: updated.zoom,
                            positionX: updated.positionX,
                            positionY: updated.positionY,
                          },
                        }));
                      },
                    });
                  }}
                  className="flex items-center gap-1 text-xs text-black"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const color = prompt(
                      'Enter background hex color (e.g. #FDCB18):',
                      project.heroImage.backgroundColor || '#F5F5F5'
                    );
                    if (color) {
                      handleUpdate((prev) => ({
                        ...prev,
                        heroImage: {
                          ...prev.heroImage,
                          backgroundColor: color,
                        },
                      }));
                    }
                  }}
                  className="flex items-center gap-1 text-xs text-black/70 hover:text-black"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Color</span>
                </button>
              </div>
            )}
          </DropzoneBox>
        </section>

        {/* 4. CONTENT SECTIONS BELOW HERO
            Flexible presentation:
            - Background Narrative & Side Visual
            - Stats Row
            - Numbered Chapters (Two-col / Three-col)
            - Callout Features
            - Process Prototype Section
            - Custom Flexible Blocks (Full-width image, Two images side by side, Text section, Image & Text)
        */}
        <div className="mt-16 sm:mt-24 space-y-20 sm:space-y-28">
          {/* Background Narrative Section */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-start">
            <div className="md:col-span-6 space-y-4">
              <h2
                className="text-[32px] sm:text-[38px] md:text-[40px] font-normal text-black tracking-[-0.02em] leading-none lowercase mb-5"
                style={{ fontFamily: 'var(--font-primary)' }}
              >
                <EditableText
                  value={project.backgroundSection.heading}
                  onChange={(val) =>
                    handleUpdate((prev) => ({
                      ...prev,
                      backgroundSection: {
                        ...prev.backgroundSection,
                        heading: val,
                      },
                    }))
                  }
                  label="Section Heading"
                />
              </h2>

              {project.backgroundSection.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[15px] sm:text-[16px] text-black/80 font-normal leading-[1.65]"
                  style={{ fontFamily: 'var(--font-primary)' }}
                >
                  <EditableText
                    value={p}
                    multiline
                    onChange={(val) => {
                      handleUpdate((prev) => {
                        const paras = [...prev.backgroundSection.paragraphs];
                        paras[pIdx] = val;
                        return {
                          ...prev,
                          backgroundSection: {
                            ...prev.backgroundSection,
                            paragraphs: paras,
                          },
                        };
                      });
                    }}
                    label={`Paragraph ${pIdx + 1}`}
                  />
                </p>
              ))}

              {isEditMode && !isPreviewMode && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdate((prev) => ({
                      ...prev,
                      backgroundSection: {
                        ...prev.backgroundSection,
                        paragraphs: [
                          ...prev.backgroundSection.paragraphs,
                          'New descriptive paragraph about project development.',
                        ],
                      },
                    }));
                  }}
                  className="text-xs text-blue-600 hover:underline pt-2 block"
                >
                  + Add paragraph
                </button>
              )}
            </div>

            <div className="md:col-span-6">
              <DropzoneBox
                imageSrc={project.backgroundSection.sideImage}
                alt={project.backgroundSection.sideImageAlt}
                label="Background Detail"
                aspectClass="aspect-[4/3]"
                backgroundColor="#F8F8F8"
                zoom={project.backgroundSection.zoom}
                positionX={project.backgroundSection.positionX}
                positionY={project.backgroundSection.positionY}
                objectFit={
                  project.backgroundSection.sideImageContain ? 'contain' : 'cover'
                }
                onImageDrop={(dataUrl) => {
                  handleUpdate((prev) => ({
                    ...prev,
                    backgroundSection: {
                      ...prev.backgroundSection,
                      sideImage: dataUrl,
                    },
                  }));
                }}
              />
            </div>
          </section>

          {/* Stats Row (If present) */}
          {project.statsRow && (
            <section className="border-t border-b border-black/10 py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                {project.statsRow.map((stat, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <div
                      className={`font-normal tracking-tight text-black ${
                        stat.isQuestion
                          ? 'text-lg sm:text-xl font-normal'
                          : 'text-3xl sm:text-4xl'
                      }`}
                      style={{ fontFamily: 'var(--font-primary)' }}
                    >
                      <EditableText
                        value={stat.value}
                        onChange={(val) => {
                          handleUpdate((prev) => {
                            if (!prev.statsRow) return prev;
                            const stats = [...prev.statsRow] as [any, any, any];
                            stats[sIdx] = { ...stats[sIdx], value: val };
                            return { ...prev, statsRow: stats };
                          });
                        }}
                        label={`Stat ${sIdx + 1} Value`}
                      />
                    </div>
                    <p className="text-xs sm:text-[13px] text-black/60 leading-relaxed">
                      <EditableText
                        value={stat.caption}
                        multiline
                        onChange={(val) => {
                          handleUpdate((prev) => {
                            if (!prev.statsRow) return prev;
                            const stats = [...prev.statsRow] as [any, any, any];
                            stats[sIdx] = { ...stats[sIdx], caption: val };
                            return { ...prev, statsRow: stats };
                          });
                        }}
                        label={`Stat ${sIdx + 1} Caption`}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Numbered Chapters */}
          {project.chapters.map((chapter, chIdx) => (
            <section key={chapter.id} className="space-y-6">
              <div className="border-b border-black/10 pb-3 flex items-center justify-between">
                <h3
                  className="text-[15px] sm:text-[16px] font-normal text-black tracking-tight"
                  style={{ fontFamily: 'var(--font-primary)' }}
                >
                  <EditableText
                    value={chapter.numberTitle}
                    onChange={(val) => {
                      handleUpdate((prev) => {
                        const chs = prev.chapters.map((c) =>
                          c.id === chapter.id ? { ...c, numberTitle: val } : c
                        );
                        return { ...prev, chapters: chs };
                      });
                    }}
                    label={`Chapter ${chIdx + 1} Title`}
                  />
                </h3>

                {isEditMode && !isPreviewMode && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate((prev) => {
                          const newItem: ProjectGalleryItem = {
                            id: `item-${Date.now()}`,
                            src: '',
                            alt: 'New chapter photo',
                            orientation: 'landscape',
                            caption: 'New visual caption',
                          };
                          const chs = prev.chapters.map((c) =>
                            c.id === chapter.id
                              ? { ...c, items: [...c.items, newItem] }
                              : c
                          );
                          return { ...prev, chapters: chs };
                        });
                      }}
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Image
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this chapter?')) {
                          handleUpdate((prev) => ({
                            ...prev,
                            chapters: prev.chapters.filter((c) => c.id !== chapter.id),
                          }));
                        }
                      }}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1 ml-2"
                    >
                      <Trash2 className="w-3 h-3" /> Delete Chapter
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Items Grid */}
              <div
                className={`grid gap-4 sm:gap-6 ${
                  chapter.items.length === 3 || chapter.layout === 'three-col'
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {chapter.items.map((item, itIdx) => (
                  <div key={item.id} className="flex flex-col space-y-3">
                    <DropzoneBox
                      imageSrc={item.src}
                      alt={item.alt}
                      label={`Photo ${itIdx + 1}`}
                      aspectClass="aspect-[4/3]"
                      backgroundColor={item.backgroundColor || '#F7F7F7'}
                      zoom={item.zoom}
                      positionX={item.positionX}
                      positionY={item.positionY}
                      objectFit={item.objectFit || 'cover'}
                      onImageDrop={(dataUrl) => {
                        handleUpdate((prev) => {
                          const chs = prev.chapters.map((c) => {
                            if (c.id !== chapter.id) return c;
                            return {
                              ...c,
                              items: c.items.map((it) =>
                                it.id === item.id ? { ...it, src: dataUrl } : it
                              ),
                            };
                          });
                          return { ...prev, chapters: chs };
                        });
                      }}
                    />

                    {item.label && (
                      <div className="text-xs font-medium text-black">
                        <EditableText
                          value={item.label}
                          onChange={(val) => {
                            handleUpdate((prev) => {
                              const chs = prev.chapters.map((c) => {
                                if (c.id !== chapter.id) return c;
                                return {
                                  ...c,
                                  items: c.items.map((it) =>
                                    it.id === item.id ? { ...it, label: val } : it
                                  ),
                                };
                              });
                              return { ...prev, chapters: chs };
                            });
                          }}
                          label="Image Label"
                        />
                      </div>
                    )}

                    {item.caption && (
                      <p className="text-xs sm:text-[13px] text-black/60 leading-relaxed">
                        <EditableText
                          value={item.caption}
                          multiline
                          onChange={(val) => {
                            handleUpdate((prev) => {
                              const chs = prev.chapters.map((c) => {
                                if (c.id !== chapter.id) return c;
                                return {
                                  ...c,
                                  items: c.items.map((it) =>
                                    it.id === item.id ? { ...it, caption: val } : it
                                  ),
                                };
                              });
                              return { ...prev, chapters: chs };
                            });
                          }}
                          label="Image Caption"
                        />
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {chapter.bottomNoteLeft && (
                <div className="pt-2">
                  <p className="text-xs sm:text-[13px] text-black/60 max-w-2xl leading-relaxed">
                    <EditableText
                      value={chapter.bottomNoteLeft}
                      multiline
                      onChange={(val) => {
                        handleUpdate((prev) => {
                          const chs = prev.chapters.map((c) =>
                            c.id === chapter.id ? { ...c, bottomNoteLeft: val } : c
                          );
                          return { ...prev, chapters: chs };
                        });
                      }}
                      label="Chapter bottom note"
                    />
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* Custom Flexible Content Blocks */}
          {project.flexibleBlocks &&
            project.flexibleBlocks.map((block) => (
              <section key={block.id} className="relative group/block space-y-4">
                {isEditMode && !isPreviewMode && (
                  <div className="flex justify-end gap-2 text-xs pb-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleUpdate((prev) => ({
                          ...prev,
                          flexibleBlocks: (prev.flexibleBlocks || []).filter(
                            (b) => b.id !== block.id
                          ),
                        }));
                      }}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove section
                    </button>
                  </div>
                )}

                {/* 1. Full-Width Image Block */}
                {block.type === 'full-image' && (
                  <div className="space-y-2">
                    <DropzoneBox
                      imageSrc={block.image1?.src}
                      alt={block.image1?.alt || ''}
                      label="Full-Width Photo"
                      aspectClass="aspect-[16/9]"
                      backgroundColor="#F7F7F7"
                      objectFit="cover"
                      onImageDrop={(dataUrl) => {
                        handleUpdate((prev) => ({
                          ...prev,
                          flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                            b.id === block.id
                              ? {
                                  ...b,
                                  image1: {
                                    ...b.image1,
                                    src: dataUrl,
                                    alt: b.image1?.alt || '',
                                  },
                                }
                              : b
                          ),
                        }));
                      }}
                    />
                    {block.image1?.caption !== undefined && (
                      <p className="text-xs text-black/60 pt-1">
                        <EditableText
                          value={block.image1.caption}
                          onChange={(val) => {
                            handleUpdate((prev) => ({
                              ...prev,
                              flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                                b.id === block.id
                                  ? {
                                      ...b,
                                      image1: {
                                        ...b.image1,
                                        src: b.image1?.src || '',
                                        alt: b.image1?.alt || '',
                                        caption: val,
                                      },
                                    }
                                  : b
                              ),
                            }));
                          }}
                          label="Photo Caption"
                        />
                      </p>
                    )}
                  </div>
                )}

                {/* 2. Two Images Side by Side */}
                {block.type === 'two-images' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <DropzoneBox
                        imageSrc={block.image1?.src}
                        alt={block.image1?.alt || ''}
                        label="Left Photo"
                        aspectClass="aspect-[4/3]"
                        backgroundColor="#F7F7F7"
                        objectFit="cover"
                        onImageDrop={(dataUrl) => {
                          handleUpdate((prev) => ({
                            ...prev,
                            flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                              b.id === block.id
                                ? {
                                    ...b,
                                    image1: {
                                      ...b.image1,
                                      src: dataUrl,
                                      alt: b.image1?.alt || '',
                                    },
                                  }
                                : b
                            ),
                          }));
                        }}
                      />
                      {block.image1?.caption !== undefined && (
                        <p className="text-xs text-black/60 pt-1">
                          <EditableText
                            value={block.image1.caption}
                            onChange={(val) => {
                              handleUpdate((prev) => ({
                                ...prev,
                                flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                                  b.id === block.id
                                    ? {
                                        ...b,
                                        image1: {
                                          ...b.image1,
                                          src: b.image1?.src || '',
                                          alt: b.image1?.alt || '',
                                          caption: val,
                                        },
                                      }
                                    : b
                                ),
                              }));
                            }}
                            label="Left Photo Caption"
                          />
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <DropzoneBox
                        imageSrc={block.image2?.src}
                        alt={block.image2?.alt || ''}
                        label="Right Photo"
                        aspectClass="aspect-[4/3]"
                        backgroundColor="#F7F7F7"
                        objectFit="cover"
                        onImageDrop={(dataUrl) => {
                          handleUpdate((prev) => ({
                            ...prev,
                            flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                              b.id === block.id
                                ? {
                                    ...b,
                                    image2: {
                                      ...b.image2,
                                      src: dataUrl,
                                      alt: b.image2?.alt || '',
                                    },
                                  }
                                : b
                            ),
                          }));
                        }}
                      />
                      {block.image2?.caption !== undefined && (
                        <p className="text-xs text-black/60 pt-1">
                          <EditableText
                            value={block.image2.caption}
                            onChange={(val) => {
                              handleUpdate((prev) => ({
                                ...prev,
                                flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                                  b.id === block.id
                                    ? {
                                        ...b,
                                        image2: {
                                          ...b.image2,
                                          src: b.image2?.src || '',
                                          alt: b.image2?.alt || '',
                                          caption: val,
                                        },
                                      }
                                    : b
                                ),
                              }));
                            }}
                            label="Right Photo Caption"
                          />
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Text Section */}
                {block.type === 'text-section' && (
                  <div className="space-y-4 max-w-3xl">
                    {block.heading && (
                      <h3
                        className="text-[28px] sm:text-[34px] font-normal tracking-[-0.02em] text-black lowercase"
                        style={{ fontFamily: 'var(--font-primary)' }}
                      >
                        <EditableText
                          value={block.heading}
                          onChange={(val) => {
                            handleUpdate((prev) => ({
                              ...prev,
                              flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                                b.id === block.id ? { ...b, heading: val } : b
                              ),
                            }));
                          }}
                          label="Section Heading"
                        />
                      </h3>
                    )}
                    {block.paragraphs?.map((p, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-[15px] sm:text-[16px] text-black/80 font-normal leading-[1.65]"
                        style={{ fontFamily: 'var(--font-primary)' }}
                      >
                        <EditableText
                          value={p}
                          multiline
                          onChange={(val) => {
                            handleUpdate((prev) => ({
                              ...prev,
                              flexibleBlocks: (prev.flexibleBlocks || []).map((b) => {
                                if (b.id !== block.id) return b;
                                const paras = [...(b.paragraphs || [])];
                                paras[pIdx] = val;
                                return { ...b, paragraphs: paras };
                              }),
                            }));
                          }}
                          label={`Paragraph ${pIdx + 1}`}
                        />
                      </p>
                    ))}
                  </div>
                )}

                {/* 4. Image & Text Combination */}
                {block.type === 'image-text' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-6 space-y-4">
                      {block.heading && (
                        <h3
                          className="text-[24px] sm:text-[30px] font-normal tracking-[-0.02em] text-black lowercase"
                          style={{ fontFamily: 'var(--font-primary)' }}
                        >
                          <EditableText
                            value={block.heading}
                            onChange={(val) => {
                              handleUpdate((prev) => ({
                                ...prev,
                                flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                                  b.id === block.id ? { ...b, heading: val } : b
                                ),
                              }));
                            }}
                            label="Heading"
                          />
                        </h3>
                      )}
                      {block.paragraphs?.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[15px] sm:text-[16px] text-black/80 font-normal leading-[1.65]"
                          style={{ fontFamily: 'var(--font-primary)' }}
                        >
                          <EditableText
                            value={p}
                            multiline
                            onChange={(val) => {
                              handleUpdate((prev) => ({
                                ...prev,
                                flexibleBlocks: (prev.flexibleBlocks || []).map((b) => {
                                  if (b.id !== block.id) return b;
                                  const paras = [...(b.paragraphs || [])];
                                  paras[pIdx] = val;
                                  return { ...b, paragraphs: paras };
                                }),
                              }));
                            }}
                            label={`Paragraph ${pIdx + 1}`}
                          />
                        </p>
                      ))}
                    </div>
                    <div className="md:col-span-6">
                      <DropzoneBox
                        imageSrc={block.image1?.src}
                        alt={block.image1?.alt || ''}
                        label="Side Photo"
                        aspectClass="aspect-[4/3]"
                        backgroundColor="#F7F7F7"
                        objectFit="cover"
                        onImageDrop={(dataUrl) => {
                          handleUpdate((prev) => ({
                            ...prev,
                            flexibleBlocks: (prev.flexibleBlocks || []).map((b) =>
                              b.id === block.id
                                ? {
                                    ...b,
                                    image1: {
                                      ...b.image1,
                                      src: dataUrl,
                                      alt: b.image1?.alt || '',
                                    },
                                  }
                                : b
                            ),
                          }));
                        }}
                      />
                    </div>
                  </div>
                )}
              </section>
            ))}

          {/* Builder Toolbar for Adding Content Sections */}
          {isEditMode && !isPreviewMode && (
            <div className="p-6 border border-dashed border-black/20 bg-black/[0.01] text-center space-y-3">
              <span className="text-xs text-black/50 block">
                + Add presentation section below hero:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newBlock: ContentBlock = {
                      id: `blk-${Date.now()}`,
                      type: 'full-image',
                      image1: { src: '', alt: 'Full width visual', caption: 'Visual caption' },
                    };
                    handleUpdate((prev) => ({
                      ...prev,
                      flexibleBlocks: [...(prev.flexibleBlocks || []), newBlock],
                    }));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-black/30 hover:border-black text-xs font-medium"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Full-Width Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newBlock: ContentBlock = {
                      id: `blk-${Date.now()}`,
                      type: 'two-images',
                      image1: { src: '', alt: 'Left visual', caption: 'Left caption' },
                      image2: { src: '', alt: 'Right visual', caption: 'Right caption' },
                    };
                    handleUpdate((prev) => ({
                      ...prev,
                      flexibleBlocks: [...(prev.flexibleBlocks || []), newBlock],
                    }));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-black/30 hover:border-black text-xs font-medium"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Two Photos Side by Side</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newBlock: ContentBlock = {
                      id: `blk-${Date.now()}`,
                      type: 'text-section',
                      heading: 'New Design Narrative',
                      paragraphs: [
                        'Describe the conceptual development, material experiments, and functional considerations of this project.',
                      ],
                    };
                    handleUpdate((prev) => ({
                      ...prev,
                      flexibleBlocks: [...(prev.flexibleBlocks || []), newBlock],
                    }));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-black/30 hover:border-black text-xs font-medium"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Text Narrative Section</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newBlock: ContentBlock = {
                      id: `blk-${Date.now()}`,
                      type: 'image-text',
                      heading: 'Key Detail',
                      paragraphs: [
                        'Detail explanation exploring tactile interactions and production manufacturing.',
                      ],
                      image1: { src: '', alt: 'Side visual' },
                    };
                    handleUpdate((prev) => ({
                      ...prev,
                      flexibleBlocks: [...(prev.flexibleBlocks || []), newBlock],
                    }));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-black/30 hover:border-black text-xs font-medium"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Photo & Text Split</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. BOTTOM PROJECT NAVIGATION */}
        <div className="border-t border-black/10 mt-28 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            type="button"
            onClick={onBack}
            className="text-xs sm:text-[13px] text-black/60 hover:text-black transition-colors flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>back to all projects</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateProject(nextProject.id)}
            className="flex items-center gap-2 text-sm sm:text-base font-normal text-black hover:opacity-70 transition-opacity lowercase"
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            <span>Next: {nextProject.hoverTitle}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
