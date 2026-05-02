import { useState, useEffect, useCallback } from 'react';

interface DualModelState {
  dualModelEnabled: boolean;
  visualModelProvider: string;
  visualModelApiKey: string;
  visualModelBaseUrl: string;
  visualModel: string;
}

const DEFAULT: DualModelState = {
  dualModelEnabled: false,
  visualModelProvider: 'gemini',
  visualModelApiKey: '',
  visualModelBaseUrl: 'https://generativelanguage.googleapis.com',
  visualModel: 'gemini-2.5-flash',
};

export function useDualModelConfig() {
  const [state, setState] = useState<DualModelState>(DEFAULT);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

  useEffect(() => {
    if (!isElectron) return;
    window.electronAPI.config.get().then((config) => {
      const provider = config.visualModelProvider ?? 'gemini';
      setState({
        dualModelEnabled: config.dualModelEnabled ?? false,
        visualModelProvider: provider,
        visualModelApiKey: config.visualModelApiKey ?? '',
        visualModelBaseUrl:
          config.visualModelBaseUrl ??
          (provider === 'nvidia'
            ? 'https://integrate.api.nvidia.com/v1'
            : 'https://generativelanguage.googleapis.com'),
        visualModel:
          config.visualModel ??
          (provider === 'nvidia' ? 'nvidia/llama-3.2-90b-vision-instruct' : 'gemini-2.5-flash'),
      });
    });
  }, [isElectron]);

  const save = useCallback(async () => {
    if (!isElectron) return;
    setIsSaving(true);
    setSaved(false);
    try {
      await window.electronAPI.config.save({
        dualModelEnabled: state.dualModelEnabled,
        visualModelProvider: state.visualModelProvider,
        visualModelApiKey: state.visualModelApiKey,
        visualModelBaseUrl: state.visualModelBaseUrl,
        visualModel: state.visualModel,
      } as Parameters<typeof window.electronAPI.config.save>[0]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  }, [isElectron, state]);

  return { state, setState, save, isSaving, saved };
}
