import React, { useState, useEffect } from 'react';
import { EditorProvider, useEditor } from './context/EditorContext';
import { NavigationHeader } from './components/NavigationHeader';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { EditorToolbar } from './components/EditorToolbar';
import { ImageEditModal } from './components/ImageEditModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';

const PortfolioAppContent: React.FC = () => {
  const { isAllowedToEdit, isEditMode, canUndo, canRedo, undo, redo, saveChanges } = useEditor();

  const [currentTab, setCurrentTab] = useState<'work' | 'about'>('work');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Global keyboard shortcuts for editing productivity (only active if allowed to edit)
  useEffect(() => {
    if (!isAllowedToEdit) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S -> Save
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveChanges();
      }
      // Cmd/Ctrl + Z -> Undo / Redo
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          if (canRedo) {
            e.preventDefault();
            redo();
          }
        } else {
          if (canUndo) {
            e.preventDefault();
            undo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAllowedToEdit, saveChanges, canUndo, canRedo, undo, redo]);

  const handleGoHome = () => {
    setActiveProjectId(null);
    setCurrentTab('work');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (tab: 'work' | 'about') => {
    setActiveProjectId(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* Sticky Header */}
      <NavigationHeader
        currentTab={activeProjectId ? 'work' : currentTab}
        isProjectPage={Boolean(activeProjectId) || currentTab === 'about'}
        onSelectTab={handleSelectTab}
        onGoHome={handleGoHome}
      />

      {/* Main Views */}
      <main className="flex-1">
        {activeProjectId ? (
          <ProjectDetailPage
            projectId={activeProjectId}
            onBack={handleGoHome}
            onNavigateProject={handleOpenProject}
          />
        ) : currentTab === 'about' ? (
          <AboutPage />
        ) : (
          <ProjectGrid onOpenProject={handleOpenProject} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Visual Editor Toolbar & Dialog Modals - only rendered in preview environment */}
      {isAllowedToEdit && (
        <>
          <EditorToolbar />
          <ImageEditModal />
          <ProjectManagerModal onOpenProject={handleOpenProject} />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <EditorProvider>
      <PortfolioAppContent />
    </EditorProvider>
  );
}
