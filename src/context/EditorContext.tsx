import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  PortfolioState,
  ProjectData,
  DesignerProfile,
  initialDesignerProfile,
  initialProjects,
} from '../data/defaultPortfolioData';
import {
  savePortfolioToStorage,
  loadPortfolioFromStorage,
  clearPortfolioStorage,
} from '../utils/storage';
import {
  isInPreviewEnvironment,
  toggleSessionEditorPermission,
} from '../utils/env';

export type SaveStatus = 'saved' | 'saving' | 'unsaved';

export interface ImageEditorTarget {
  id: string;
  label: string;
  src: string;
  alt: string;
  zoom?: number;
  positionX?: number;
  positionY?: number;
  objectFit?: 'cover' | 'contain';
  onSave: (updated: {
    src: string;
    alt: string;
    zoom: number;
    positionX: number;
    positionY: number;
    objectFit?: 'cover' | 'contain';
  }) => void;
  onRemove?: () => void;
}

interface EditorContextType {
  isAllowedToEdit: boolean;
  isEditMode: boolean;
  isPreviewMode: boolean;
  saveStatus: SaveStatus;
  portfolioState: PortfolioState;
  canUndo: boolean;
  canRedo: boolean;

  // Mode toggles
  toggleEditMode: () => void;
  setEditMode: (val: boolean) => void;
  togglePreviewMode: () => void;
  setPreviewMode: (val: boolean) => void;

  // History & Storage
  undo: () => void;
  redo: () => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  resetToDefaults: () => Promise<void>;
  emptyAllImages: () => void;

  // Profile updaters
  updateProfile: (partial: Partial<DesignerProfile>) => void;

  // Project management
  updateProject: (
    projectId: string,
    updater: (prev: ProjectData) => ProjectData
  ) => void;
  addProject: (category?: 'product' | 'packaging') => string;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => string;
  reorderProjects: (
    category: 'product' | 'packaging',
    fromIndex: number,
    toIndex: number
  ) => void;

  // Modal dialogs
  activeImageTarget: ImageEditorTarget | null;
  openImageEditor: (target: ImageEditorTarget) => void;
  closeImageEditor: () => void;

  isProjectManagerOpen: boolean;
  openProjectManager: () => void;
  closeProjectManager: () => void;
}

function stripDemoImages(state: PortfolioState): PortfolioState {
  const sanitizeUrl = (url?: string): string => {
    if (!url) return '';
    // NEVER strip user uploads, local files, or data URLs
    if (url.startsWith('/uploads') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    if (url.includes('rmcdn.net') || url.includes('unsplash.com')) {
      return '';
    }
    return url;
  };

  return {
    profile: {
      ...state.profile,
      headingProduct: '',
      portraitImage: sanitizeUrl(state.profile.portraitImage),
    },
    projects: state.projects.map((p) => ({
      ...p,
      cardConfig: {
        ...p.cardConfig,
        imageSrc: sanitizeUrl(p.cardConfig.imageSrc),
        secondaryImageSrc: sanitizeUrl(p.cardConfig.secondaryImageSrc),
      },
      headerMeta: {
        ...p.headerMeta,
        brandLogoUrl: sanitizeUrl(p.headerMeta.brandLogoUrl),
        awardBadgeLogo: sanitizeUrl(p.headerMeta.awardBadgeLogo),
        awardLines: (p.headerMeta.awardLines || []).filter(
          (line) =>
            !['Award:', 'Ung Svensk Form 2024,', 'Industridesign'].includes(
              line.trim()
            )
        ),
      },
      heroImage: {
        ...p.heroImage,
        src: sanitizeUrl(p.heroImage.src),
      },
      backgroundSection: {
        ...p.backgroundSection,
        sideImage: sanitizeUrl(p.backgroundSection.sideImage),
      },
      statsRow: p.statsRow
        ? (p.statsRow.map((s) => ({
            ...s,
            image: sanitizeUrl(s.image),
          })) as any)
        : undefined,
      chapters: p.chapters.map((ch) => ({
        ...ch,
        items: ch.items.map((it) => ({
          ...it,
          src: sanitizeUrl(it.src),
        })),
      })),
      featureSections: p.featureSections?.map((f) => ({
        ...f,
        mainImage: sanitizeUrl(f.mainImage),
        secondaryImage: sanitizeUrl(f.secondaryImage),
      })),
      processSection: p.processSection
        ? {
            ...p.processSection,
            leadImage: sanitizeUrl(p.processSection.leadImage),
            sideImage: sanitizeUrl(p.processSection.sideImage),
            secondaryLeadImage: sanitizeUrl(p.processSection.secondaryLeadImage),
            secondarySideImage: sanitizeUrl(p.processSection.secondarySideImage),
            bottomGridImages: p.processSection.bottomGridImages.map((b) => ({
              ...b,
              src: sanitizeUrl(b.src),
            })),
          }
        : undefined,
    })),
  };
}

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAllowedToEdit, setIsAllowedToEdit] = useState<boolean>(() =>
    isInPreviewEnvironment()
  );
  const [isEditMode, setIsEditMode] = useState<boolean>(() =>
    isInPreviewEnvironment()
  );
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');

  // Keyboard shortcut listener: Ctrl+Alt+E (or Cmd+Alt+E) toggles editor access
  useEffect(() => {
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const nextAllowed = toggleSessionEditorPermission();
        setIsAllowedToEdit(nextAllowed);
        if (nextAllowed) {
          setIsEditMode(true);
        } else {
          setIsEditMode(false);
          setIsPreviewMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);
    return () => window.removeEventListener('keydown', handleKeyShortcut);
  }, []);

  // Core portfolio state
  const [portfolioState, setPortfolioState] = useState<PortfolioState>(() =>
    stripDemoImages({
      profile: initialDesignerProfile,
      projects: initialProjects,
    })
  );

  // Saved baseline for discard functionality
  const savedBaselineRef = useRef<PortfolioState>(portfolioState);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<PortfolioState[]>([]);
  const [future, setFuture] = useState<PortfolioState[]>([]);

  // Modals
  const [activeImageTarget, setActiveImageTarget] =
    useState<ImageEditorTarget | null>(null);
  const [isProjectManagerOpen, setIsProjectManagerOpen] =
    useState<boolean>(false);

  // Auto-save timer ref
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from persistent disk storage / cache on startup
  useEffect(() => {
    let isMounted = true;
    loadPortfolioFromStorage<PortfolioState>().then((stored) => {
      if (isMounted && stored && stored.profile && stored.projects) {
        // Do NOT strip user's uploaded images or saved modifications!
        setPortfolioState(stored);
        savedBaselineRef.current = stored;
        setSaveStatus('saved');
      } else if (isMounted) {
        const cleaned = stripDemoImages({
          profile: initialDesignerProfile,
          projects: initialProjects,
        });
        setPortfolioState(cleaned);
        savedBaselineRef.current = cleaned;
        savePortfolioToStorage(cleaned);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to commit state changes with undo history and auto-save trigger
  const commitState = useCallback(
    (newStateOrUpdater: PortfolioState | ((prev: PortfolioState) => PortfolioState)) => {
      setPortfolioState((prev) => {
        const next =
          typeof newStateOrUpdater === 'function'
            ? newStateOrUpdater(prev)
            : newStateOrUpdater;

        // Push current state to undo history (keep max 25 items)
        setHistory((hist) => [...hist.slice(-24), prev]);
        setFuture([]); // clear redo on new change
        setSaveStatus('unsaved');

        // Trigger debounced auto-save
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
        autoSaveTimeoutRef.current = setTimeout(() => {
          setSaveStatus('saving');
          savePortfolioToStorage(next).then(() => {
            savedBaselineRef.current = next;
            setSaveStatus('saved');
          });
        }, 1200);

        return next;
      });
    },
    []
  );

  const saveChanges = useCallback(async () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    setSaveStatus('saving');
    await savePortfolioToStorage(portfolioState);
    savedBaselineRef.current = portfolioState;
    setSaveStatus('saved');
  }, [portfolioState]);

  const discardChanges = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    setPortfolioState(savedBaselineRef.current);
    setHistory([]);
    setFuture([]);
    setSaveStatus('saved');
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((hist) => hist.slice(0, hist.length - 1));
    setFuture((fut) => [portfolioState, ...fut]);
    setPortfolioState(previous);
    setSaveStatus('unsaved');
  }, [history, portfolioState]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((fut) => fut.slice(1));
    setHistory((hist) => [...hist, portfolioState]);
    setPortfolioState(next);
    setSaveStatus('unsaved');
  }, [future, portfolioState]);

  const resetToDefaults = useCallback(async () => {
    const defaultState: PortfolioState = {
      profile: initialDesignerProfile,
      projects: initialProjects,
    };
    await clearPortfolioStorage();
    await savePortfolioToStorage(defaultState);
    setPortfolioState(defaultState);
    savedBaselineRef.current = defaultState;
    setHistory([]);
    setFuture([]);
    setSaveStatus('saved');
  }, []);

  const updateProfile = useCallback(
    (partial: Partial<DesignerProfile>) => {
      commitState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...partial,
        },
      }));
    },
    [commitState]
  );

  const updateProject = useCallback(
    (projectId: string, updater: (prev: ProjectData) => ProjectData) => {
      commitState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === projectId ? updater(p) : p
        ),
      }));
    },
    [commitState]
  );

  const addProject = useCallback(
    (category: 'product' | 'packaging' = 'product') => {
      const newId = `project-${Date.now()}`;
      const newSlug = `new-project-${Date.now().toString().slice(-4)}`;
      const newProject: ProjectData = {
        id: newId,
        slug: newSlug,
        category,
        hoverTitle: 'New Project Title',
        hoverTitleColor: 'dark',
        pageTitleLines: ['New Project', 'Case Study'],
        cardConfig: {
          aspect: 'landscape',
          backgroundColor: '#F5F5F5',
          imageSrc:
            'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
          imageAlt: 'New project cover image',
        },
        headerMeta: {
          brandLogoText: 'PROJECT',
          contextLines: [
            'Industrial Design',
            'Concept Development',
            'Selected Works',
          ],
        },
        heroImage: {
          src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1600&q=80',
          alt: 'New project hero view',
          backgroundColor: '#F5F5F5',
        },
        backgroundSection: {
          heading: 'Background',
          paragraphs: [
            'Describe the origin, problem framing, and design ambition of this project here. Click on this paragraph in Edit Mode to modify the text directly.',
          ],
          sideImage:
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
          sideImageAlt: 'Project background detail',
        },
        chapters: [
          {
            id: `ch-${Date.now()}-1`,
            numberTitle: '1.Concept',
            layout: 'two-col',
            items: [
              {
                id: `it-${Date.now()}-1`,
                src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1000&q=80',
                alt: 'Concept exploration',
                orientation: 'landscape',
                caption: 'Initial volumetric studies and physical form explorations.',
              },
              {
                id: `it-${Date.now()}-2`,
                src: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
                alt: 'Detail view',
                orientation: 'landscape',
                caption: 'Tactile interaction and material surface refinement.',
              },
            ],
          },
        ],
      };

      commitState((prev) => ({
        ...prev,
        projects: [newProject, ...prev.projects],
      }));

      return newSlug;
    },
    [commitState]
  );

  const deleteProject = useCallback(
    (projectId: string) => {
      commitState((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== projectId),
      }));
    },
    [commitState]
  );

  const duplicateProject = useCallback(
    (projectId: string) => {
      let createdSlug = '';
      commitState((prev) => {
        const found = prev.projects.find((p) => p.id === projectId);
        if (!found) return prev;
        const newId = `project-${Date.now()}`;
        createdSlug = `${found.slug}-copy-${Date.now().toString().slice(-4)}`;
        const clone: ProjectData = {
          ...JSON.parse(JSON.stringify(found)),
          id: newId,
          slug: createdSlug,
          hoverTitle: `${found.hoverTitle} (Copy)`,
        };
        const index = prev.projects.findIndex((p) => p.id === projectId);
        const updated = [...prev.projects];
        updated.splice(index + 1, 0, clone);
        return {
          ...prev,
          projects: updated,
        };
      });
      return createdSlug;
    },
    [commitState]
  );

  const reorderProjects = useCallback(
    (category: 'product' | 'packaging', fromIndex: number, toIndex: number) => {
      commitState((prev) => {
        const catProjects = prev.projects.filter((p) => p.category === category);
        const otherProjects = prev.projects.filter((p) => p.category !== category);

        if (
          fromIndex < 0 ||
          fromIndex >= catProjects.length ||
          toIndex < 0 ||
          toIndex >= catProjects.length
        ) {
          return prev;
        }

        const [moved] = catProjects.splice(fromIndex, 1);
        catProjects.splice(toIndex, 0, moved);

        const newProjects =
          category === 'product'
            ? [...catProjects, ...otherProjects]
            : [...otherProjects, ...catProjects];

        return {
          ...prev,
          projects: newProjects,
        };
      });
    },
    [commitState]
  );

  const openImageEditor = useCallback((target: ImageEditorTarget) => {
    setActiveImageTarget(target);
  }, []);

  const closeImageEditor = useCallback(() => {
    setActiveImageTarget(null);
  }, []);

  const openProjectManager = useCallback(() => {
    setIsProjectManagerOpen(true);
  }, []);

  const emptyAllImages = useCallback(() => {
    commitState((prev) => ({
      profile: {
        ...prev.profile,
        portraitImage: '',
      },
      projects: prev.projects.map((p) => ({
        ...p,
        cardConfig: {
          ...p.cardConfig,
          imageSrc: '',
          secondaryImageSrc: '',
        },
        headerMeta: {
          ...p.headerMeta,
          brandLogoUrl: '',
          awardBadgeLogo: '',
        },
        heroImage: {
          ...p.heroImage,
          src: '',
        },
        backgroundSection: {
          ...p.backgroundSection,
          sideImage: '',
        },
        statsRow: p.statsRow
          ? (p.statsRow.map((s) => ({ ...s, image: '' })) as any)
          : undefined,
        chapters: p.chapters.map((ch) => ({
          ...ch,
          items: ch.items.map((it) => ({ ...it, src: '' })),
        })),
        featureSections: p.featureSections?.map((f) => ({
          ...f,
          mainImage: '',
          secondaryImage: '',
        })),
        processSection: p.processSection
          ? {
              ...p.processSection,
              leadImage: '',
              sideImage: '',
              secondaryLeadImage: '',
              secondarySideImage: '',
              bottomGridImages: p.processSection.bottomGridImages.map((b) => ({
                ...b,
                src: '',
              })),
            }
          : undefined,
      })),
    }));
  }, [commitState]);

  const closeProjectManager = useCallback(() => {
    setIsProjectManagerOpen(false);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        isAllowedToEdit,
        isEditMode: isAllowedToEdit ? isEditMode : false,
        isPreviewMode,
        saveStatus,
        portfolioState,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        toggleEditMode: () => {
          if (!isAllowedToEdit) return;
          setIsEditMode((v) => !v);
          setIsPreviewMode(false);
        },
        setEditMode: (v) => {
          if (!isAllowedToEdit && v) return;
          setIsEditMode(v);
          setIsPreviewMode(false);
        },
        togglePreviewMode: () => setIsPreviewMode((v) => !v),
        setPreviewMode: setIsPreviewMode,
        undo,
        redo,
        saveChanges,
        discardChanges,
        resetToDefaults,
        emptyAllImages,
        updateProfile,
        updateProject,
        addProject,
        deleteProject,
        duplicateProject,
        reorderProjects,
        activeImageTarget,
        openImageEditor,
        closeImageEditor,
        isProjectManagerOpen,
        openProjectManager,
        closeProjectManager,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
