import React from 'react';
import { useEditor } from '../context/EditorContext';
import { ProjectData } from '../data/defaultPortfolioData';
import { EditableText } from './EditableText';
import { DropzoneBox } from './DropzoneBox';
import { Camera, Plus, Trash2, Copy } from 'lucide-react';

interface ProjectGridProps {
  onOpenProject: (projectId: string) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ onOpenProject }) => {
  const {
    portfolioState,
    isEditMode,
    isPreviewMode,
    updateProfile,
    updateProject,
    duplicateProject,
    deleteProject,
    openImageEditor,
    addProject,
  } = useEditor();

  const { profile, projects } = portfolioState;

  // Find projects by id or slug
  const getProject = (idOrSlug: string): ProjectData | undefined => {
    return projects.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  };

  const platepal = getProject('platepal') || projects[0];
  const beolab90 = getProject('beolab90') || projects[1];
  const einride = getProject('einride') || projects[3];
  const scoutresq = getProject('scoutresq') || projects[4];
  const spark = getProject('spark') || projects[5];
  const fjallraven = getProject('fjallraven') || projects[6];
  const divemodule = getProject('divemodule') || projects[7];
  const domesticrobots = getProject('domesticrobots') || projects[8];
  const softmessages = getProject('softmessages') || projects[9];

  // Helper to render individual card with direct drag-and-drop & empty placeholder support
  const renderCard = (
    project: ProjectData | undefined,
    aspectClass: string,
    customImageClass: string = 'object-contain',
    imgStyle?: React.CSSProperties
  ) => {
    if (!project) return null;

    const isLight = project.hoverTitleColor === 'light';

    return (
      <DropzoneBox
        key={project.id}
        imageSrc={project.cardConfig.imageSrc}
        alt={project.cardConfig.imageAlt || project.hoverTitle}
        label={`${project.hoverTitle} Cover`}
        aspectClass={aspectClass}
        backgroundColor={project.cardConfig.backgroundColor || '#F5F5F5'}
        zoom={project.cardConfig.imageStyle?.zoom}
        positionX={project.cardConfig.imageStyle?.positionX}
        positionY={project.cardConfig.imageStyle?.positionY}
        imgStyle={imgStyle}
        objectFit={
          project.cardConfig.imageStyle?.objectFit ||
          (customImageClass.includes('object-cover') ? 'cover' : 'contain')
        }
        isLightText={isLight}
        onImageDrop={(dataUrl) => {
          updateProject(project.id, (prev) => ({
            ...prev,
            cardConfig: {
              ...prev.cardConfig,
              imageSrc: dataUrl,
            },
          }));
        }}
        className={
          isEditMode && !isPreviewMode
            ? 'ring-1 ring-black/15 hover:ring-blue-400'
            : ''
        }
      >
        {/* Optional secondary overlay image if user sets one */}
        {project.cardConfig.secondaryImageSrc && (
          <div
            className="absolute pointer-events-none transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            style={{
              left: `${project.cardConfig.secondaryImageStyle?.leftPercent ?? 30}%`,
              top: `${project.cardConfig.secondaryImageStyle?.topPercent ?? 16}%`,
              width: `${project.cardConfig.secondaryImageStyle?.widthPercent ?? 40}%`,
              height: `${project.cardConfig.secondaryImageStyle?.heightPercent ?? 38}%`,
            }}
          >
            <img
              src={project.cardConfig.secondaryImageSrc}
              alt="Secondary overlay"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Hover Title: appears at top-left of the card on hover */}
        <div
          className={`absolute top-2 left-2 z-10 transition-opacity duration-200 ${
            isEditMode && !isPreviewMode
              ? 'opacity-100 bg-white/85 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs'
              : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => {
            // In normal mode, clicking title opens project
            if (!isEditMode || isPreviewMode) {
              e.stopPropagation();
              onOpenProject(project.id);
            }
          }}
        >
          <span
            className={`text-[13px] sm:text-[14px] font-normal tracking-[-0.01em] ${
              isLight && (!isEditMode || isPreviewMode)
                ? 'text-white'
                : 'text-black'
            }`}
            style={{ fontFamily: 'var(--font-primary)' }}
          >
            <EditableText
              value={project.hoverTitle}
              onChange={(val) =>
                updateProject(project.id, (prev) => ({
                  ...prev,
                  hoverTitle: val,
                }))
              }
              label="Hover Title"
            />
          </span>
        </div>

        {/* When image exists and user clicks in normal mode, open case study */}
        {project.cardConfig.imageSrc && (!isEditMode || isPreviewMode) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenProject(project.id);
            }}
            className="absolute inset-0 cursor-pointer z-10"
          />
        )}

        {/* Edit Mode Quick Controls */}
        {isEditMode && !isPreviewMode && (
          <div className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-white/95 backdrop-blur-md px-1.5 py-1 border border-black/10 shadow-sm">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openImageEditor({
                  id: `cover-${project.id}`,
                  label: `${project.hoverTitle} Cover`,
                  src: project.cardConfig.imageSrc,
                  alt: project.cardConfig.imageAlt,
                  zoom: project.cardConfig.imageStyle?.zoom,
                  positionX: project.cardConfig.imageStyle?.positionX,
                  positionY: project.cardConfig.imageStyle?.positionY,
                  objectFit:
                    project.cardConfig.imageStyle?.objectFit ||
                    (customImageClass.includes('object-cover') ? 'cover' : 'contain'),
                  onSave: (updated) => {
                    updateProject(project.id, (prev) => ({
                      ...prev,
                      cardConfig: {
                        ...prev.cardConfig,
                        imageSrc: updated.src,
                        imageAlt: updated.alt,
                        imageStyle: {
                          ...prev.cardConfig.imageStyle,
                          zoom: updated.zoom,
                          positionX: updated.positionX,
                          positionY: updated.positionY,
                          objectFit: updated.objectFit,
                        },
                      },
                    }));
                  },
                });
              }}
              title="Replace / Adjust Cover Photo"
              className="p-1 text-black/70 hover:text-black hover:bg-black/5"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                duplicateProject(project.id);
              }}
              title="Duplicate Project"
              className="p-1 text-black/70 hover:text-black hover:bg-black/5"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete project "${project.hoverTitle}"?`)) {
                  deleteProject(project.id);
                }
              }}
              title="Delete Project"
              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenProject(project.id);
              }}
              title="Open Case Study"
              className="px-1.5 py-0.5 text-[11px] bg-black text-white hover:bg-black/80 font-medium"
            >
              Open
            </button>
          </div>
        )}
      </DropzoneBox>
    );
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-2 md:px-2">
      {/* SECTION 1: PRODUCT DESIGN */}
      <section className="mb-24 sm:mb-32">
        {/* Generous whitespace matching reference photo (top: 8px to top: 241px = ~190px) */}
        <div className="pt-[140px] sm:pt-[170px] md:pt-[190px]">
          {isEditMode && !isPreviewMode && (
            <div className="flex items-center justify-end mb-[15px]">
              <button
                type="button"
                onClick={() => addProject('product')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs border border-black/20 text-black hover:border-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product Case Study</span>
              </button>
            </div>
          )}
        </div>

        {/* BLOCK 1:
            Left Col: Plate Pal (500x472, yellow)
            Right Col: Beolab 90 (500x232) + 8px gap + Beosound Tableau (500x232) = 472px total height!
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Left Column: Plate Pal */}
          <div>
            {renderCard(platepal, 'aspect-[500/472]', 'object-contain p-6 sm:p-10')}
          </div>

          {/* Right Column: Beolab 90 (single square frame matching left column) */}
          <div>
            {renderCard(beolab90, 'aspect-[500/472]', 'object-cover')}
          </div>
        </div>

        {/* BLOCK 2:
            Left Col: Einride (500x232) + 8px gap + Scout ResQ (500x232) = 472px total height!
            Right Col: Spark (500x472, blue)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          {/* Left Column: Stack of two 500x232 cards with 8px gap */}
          <div className="flex flex-col gap-2">
            {renderCard(einride, 'aspect-[500/232]', 'object-contain p-6')}
            {renderCard(scoutresq, 'aspect-[500/232]', 'object-contain p-4')}
          </div>

          {/* Right Column: Spark */}
          <div>
            {renderCard(spark, 'aspect-[500/472]', 'object-contain p-8')}
          </div>
        </div>

        {/* BLOCK 3:
            Left Col: Fjällräven (500x480)
            Right Col: Diving Module (500x480)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            {renderCard(fjallraven, 'aspect-[500/480]', 'object-contain p-6')}
          </div>
          <div>
            {renderCard(divemodule, 'aspect-[500/480]', 'object-contain p-6', { width: '474px' })}
          </div>
        </div>

        {/* BLOCK 4:
            Left Col: Domestic Robots (500x232)
            Right Col: Soft Messages (500x232)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div>
            {renderCard(domesticrobots, 'aspect-[500/232]', 'object-cover')}
          </div>
          <div>
            {renderCard(softmessages, 'aspect-[500/232]', 'object-contain p-4')}
          </div>
        </div>
      </section>

    </div>
  );
};
