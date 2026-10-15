import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import { ProjectData } from '../data/defaultPortfolioData';
import { uploadImageFile } from '../utils/imageUpload';
import {
  X,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Camera,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProjectManagerModalProps {
  onOpenProject: (projectId: string) => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  onOpenProject,
}) => {
  const {
    isProjectManagerOpen,
    closeProjectManager,
    portfolioState,
    updateProject,
    addProject,
    deleteProject,
    duplicateProject,
    reorderProjects,
    openImageEditor,
  } = useEditor();

  const [activeCategory, setActiveCategory] = useState<'all' | 'product' | 'packaging'>('all');

  if (!isProjectManagerOpen) return null;

  const { projects } = portfolioState;

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="manager-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={closeProjectManager}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white border border-black/10 shadow-2xl p-6 text-black select-none max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-black" />
            <div>
              <h2 id="manager-modal-title" className="text-base font-semibold tracking-tight">
                Project Manager
              </h2>
              <p className="text-xs text-black/50">
                Reorder, add, duplicate, or customize portfolio case studies.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeProjectManager}
            className="p-1 hover:bg-black/5 text-black/60 hover:text-black rounded transition-colors"
            aria-label="Close project manager"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Category filter + Add project */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-black/50 mr-1">Filter:</span>
            {(['all', 'product', 'packaging'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-black text-white font-medium'
                    : 'bg-black/5 hover:bg-black/10 text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const slug = addProject('product');
                // Optional: immediately switch or notify
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium hover:bg-black/85 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Product Case Study</span>
            </button>
            <button
              type="button"
              onClick={() => {
                addProject('packaging');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-black/20 text-black text-xs font-medium hover:border-black transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Packaging</span>
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-black/5">
          {filteredProjects.map((project, idx) => {
            const catProjects = projects.filter((p) => p.category === project.category);
            const catIndex = catProjects.findIndex((p) => p.id === project.id);

            return (
              <div
                key={project.id}
                className="pt-2.5 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.02] px-2 rounded transition-colors"
              >
                {/* Thumbnail & Title Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="relative w-14 h-12 bg-[#F0F0F0] shrink-0 overflow-hidden flex items-center justify-center border border-black/10 group cursor-pointer"
                    style={{
                      backgroundColor: project.cardConfig.backgroundColor || '#F0F0F0',
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        try {
                          const diskUrl = await uploadImageFile(file);
                          updateProject(project.id, (prev) => ({
                            ...prev,
                            cardConfig: { ...prev.cardConfig, imageSrc: diskUrl },
                          }));
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    }}
                    onClick={() =>
                      openImageEditor({
                        id: `cover-mgr-${project.id}`,
                        label: `${project.hoverTitle} Cover`,
                        src: project.cardConfig.imageSrc,
                        alt: project.cardConfig.imageAlt,
                        zoom: project.cardConfig.imageStyle?.zoom,
                        positionX: project.cardConfig.imageStyle?.positionX,
                        positionY: project.cardConfig.imageStyle?.positionY,
                        objectFit: project.cardConfig.imageStyle?.objectFit || 'contain',
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
                      })
                    }
                    title="Click to replace cover photo"
                  >
                    {project.cardConfig.imageSrc ? (
                      <img
                        src={project.cardConfig.imageSrc}
                        alt={project.hoverTitle}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] text-black/40">No Cover</span>
                    )}
                    <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={project.hoverTitle}
                        onChange={(e) =>
                          updateProject(project.id, (prev) => ({
                            ...prev,
                            hoverTitle: e.target.value,
                          }))
                        }
                        className="font-medium text-xs text-black border-b border-transparent hover:border-black/30 focus:border-black focus:outline-none bg-transparent w-full truncate py-0.5"
                        title="Click to rename project title"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-black/50">
                      <span className="uppercase tracking-wider font-mono text-[10px] bg-black/5 px-1 py-0.2">
                        {project.category}
                      </span>
                      <span>slug: /{project.slug}</span>
                      <span>• {project.chapters.length} chapters</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Move Up / Down, Duplicate, Delete, Open */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-black/10 rounded overflow-hidden">
                    <button
                      type="button"
                      disabled={catIndex === 0}
                      onClick={() =>
                        reorderProjects(project.category, catIndex, catIndex - 1)
                      }
                      title="Move up in grid"
                      className="p-1 hover:bg-black/5 text-black/70 hover:text-black disabled:opacity-25"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={catIndex === catProjects.length - 1}
                      onClick={() =>
                        reorderProjects(project.category, catIndex, catIndex + 1)
                      }
                      title="Move down in grid"
                      className="p-1 hover:bg-black/5 text-black/70 hover:text-black disabled:opacity-25 border-l border-black/10"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={() => duplicateProject(project.id)}
                    title="Duplicate Project"
                    className="p-1.5 hover:bg-black/5 text-black/70 hover:text-black rounded"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete project "${project.hoverTitle}"?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    title="Delete Project"
                    className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Open Project Page */}
                  <button
                    type="button"
                    onClick={() => {
                      closeProjectManager();
                      onOpenProject(project.id);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-black text-white text-xs font-medium hover:bg-black/85"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-black/10 pt-3 mt-3 flex items-center justify-between text-xs text-black/60">
          <span>{projects.length} total projects</span>
          <button
            type="button"
            onClick={closeProjectManager}
            className="px-4 py-1.5 bg-black text-white hover:bg-black/85"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
