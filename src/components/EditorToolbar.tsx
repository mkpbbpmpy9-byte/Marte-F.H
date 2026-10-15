import React, { useState } from 'react';
import { useEditor } from '../context/EditorContext';
import {
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Plus,
  Layers,
  Check,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';

export const EditorToolbar: React.FC = () => {
  const {
    isAllowedToEdit,
    isEditMode,
    isPreviewMode,
    saveStatus,
    canUndo,
    canRedo,
    undo,
    redo,
    saveChanges,
    discardChanges,
    resetToDefaults,
    emptyAllImages,
    togglePreviewMode,
    toggleEditMode,
    openProjectManager,
    addProject,
    portfolioState,
  } = useEditor();

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  if (!isAllowedToEdit || !isEditMode) return null;

  // If in Preview Mode, show only a minimal floating "Exit Preview" pill
  if (isPreviewMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
        <button
          type="button"
          onClick={togglePreviewMode}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-xs font-medium shadow-2xl hover:bg-black/85 transition-all border border-white/20"
        >
          <EyeOff className="w-4 h-4" />
          <span>Exit Preview (Back to Editing)</span>
        </button>
      </div>
    );
  }

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(portfolioState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportMenu(false);
  };

  return (
    <aside
      aria-label="Visual website editing controls"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] w-auto animate-slideUp select-none"
    >
      <div className="bg-black/95 backdrop-blur-md text-white border border-white/15 shadow-2xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-3 text-xs">
        {/* Status indicator */}
        <div className="flex items-center gap-2 pr-2 border-r border-white/20">
          <span
            className={`w-2 h-2 rounded-full ${
              saveStatus === 'saved'
                ? 'bg-emerald-400'
                : saveStatus === 'saving'
                ? 'bg-blue-400 animate-ping'
                : 'bg-amber-400'
            }`}
          />
          <span className="hidden sm:inline text-[11px] text-white/70">
            {saveStatus === 'saved'
              ? 'Saved to disk'
              : saveStatus === 'saving'
              ? 'Saving to disk...'
              : 'Unsaved'}
          </span>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canUndo}
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-white/70 hover:text-white disabled:opacity-25 hover:bg-white/10 rounded transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={redo}
            title="Redo (Ctrl+Shift+Z)"
            className="p-1.5 text-white/70 hover:text-white disabled:opacity-25 hover:bg-white/10 rounded transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-white/20" />

        {/* Add Project */}
        <button
          type="button"
          onClick={() => addProject('product')}
          className="flex items-center gap-1.5 px-2.5 py-1 text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Add a new project"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Add Project</span>
        </button>

        {/* Manage Projects Modal */}
        <button
          type="button"
          onClick={openProjectManager}
          className="flex items-center gap-1.5 px-2.5 py-1 text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Reorder and manage all projects"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Projects</span>
        </button>

        {/* Preview as visitor */}
        <button
          type="button"
          onClick={togglePreviewMode}
          className="flex items-center gap-1.5 px-2.5 py-1 text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors"
          title="Preview website without editing outlines"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Preview</span>
        </button>

        <div className="h-4 w-px bg-white/20" />

        {/* Save button */}
        <button
          type="button"
          onClick={() => saveChanges()}
          className="flex items-center gap-1 px-3 py-1 bg-white text-black font-medium hover:bg-white/90 transition-colors"
          title="Save changes to browser storage"
        >
          <Save className="w-3 h-3" />
          <span>Save</span>
        </button>

        {/* Cancel / Discard */}
        <button
          type="button"
          onClick={discardChanges}
          title="Discard unsaved changes since last save"
          className="hidden lg:flex items-center gap-1 px-2 py-1 text-white/60 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Cancel</span>
        </button>

        {/* Backup / Export dropdown toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu((v) => !v)}
            title="Backup & Reset Options"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {showExportMenu && (
            <div className="absolute bottom-full mb-2 right-0 w-48 bg-[#1A1A1A] border border-white/15 shadow-xl p-1 text-xs text-white space-y-1">
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full text-left px-2.5 py-1.5 hover:bg-white/10 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  if (confirm('Empty all image boxes on the website?')) {
                    emptyAllImages();
                  }
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-white/10 text-amber-300 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Empty All Photos</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  setShowResetConfirm(true);
                }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-red-950 text-red-400 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          )}
        </div>

        {/* Done Editing */}
        <button
          type="button"
          onClick={toggleEditMode}
          className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
          title="Exit visual editing mode"
        >
          <Check className="w-3 h-3" />
          <span>Done</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="bg-white text-black max-w-sm w-full p-6 border border-black/10 shadow-2xl">
            <h3 id="reset-modal-title" className="text-base font-semibold mb-2">Reset to Original Defaults?</h3>
            <p className="text-xs text-black/70 mb-5 leading-relaxed">
              This will restore all original projects, text, and photos from the
              initial portfolio template. Any custom uploads and edits will be
              cleared.
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 border border-black/20 hover:border-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
