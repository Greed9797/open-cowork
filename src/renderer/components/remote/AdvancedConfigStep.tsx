/**
 * AdvancedConfigStep — gateway port, working directory, auto-approve, and remote model
 */

import { useTranslation } from 'react-i18next';

const REMOTE_MODEL_OPTIONS = [
  { value: '', label: 'Use global setting' },
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
  { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
  { value: 'MiniMax-M2.5', label: 'MiniMax M2.5' },
  { value: 'MiniMax-M2.7', label: 'MiniMax M2.7' },
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'anthropic/claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (OpenRouter)' },
];

interface Props {
  defaultWorkingDirectory: string;
  gatewayPort: number;
  autoApproveSafeTools: boolean;
  remoteModel: string;
  onWorkingDirectoryChange: (value: string) => void;
  onGatewayPortChange: (value: number) => void;
  onAutoApproveChange: (value: boolean) => void;
  onRemoteModelChange: (value: string) => void;
}

export function AdvancedConfigStep({
  defaultWorkingDirectory,
  gatewayPort,
  autoApproveSafeTools,
  remoteModel,
  onWorkingDirectoryChange,
  onGatewayPortChange,
  onAutoApproveChange,
  onRemoteModelChange,
}: Props) {
  const { t } = useTranslation();

  const isCustomModel =
    remoteModel !== '' && !REMOTE_MODEL_OPTIONS.some((o) => o.value === remoteModel);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-text-primary mb-1">{t('remote.advancedTitle')}</h3>
        <p className="text-sm text-text-secondary">{t('remote.advancedDesc')}</p>
      </div>

      <div className="space-y-4">
        {/* Remote Model */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t('remote.remoteModel', 'Remote Session Model')}
          </label>
          <select
            value={isCustomModel ? '__custom__' : remoteModel}
            onChange={(e) => {
              if (e.target.value !== '__custom__') onRemoteModelChange(e.target.value);
            }}
            className="w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
          >
            {REMOTE_MODEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {isCustomModel && <option value="__custom__">{remoteModel} (custom)</option>}
          </select>
          <p className="text-xs text-text-muted mt-1.5">
            {t(
              'remote.remoteModelHint',
              'Model used for all remote sessions. Leave as "Use global setting" to follow your main API config.'
            )}
          </p>
          {/* Custom model input */}
          <input
            type="text"
            value={remoteModel}
            onChange={(e) => onRemoteModelChange(e.target.value)}
            className="mt-2 w-full px-4 py-2.5 bg-surface-hover border border-border rounded-xl text-text-primary text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            placeholder={t(
              'remote.remoteModelCustomPlaceholder',
              'Custom model ID (e.g. MiniMax-M2.5)'
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t('remote.defaultWorkingDirectory')}
          </label>
          <input
            type="text"
            value={defaultWorkingDirectory}
            onChange={(e) => onWorkingDirectoryChange(e.target.value)}
            className="w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-primary focus:border-accent focus:outline-none"
            placeholder={t('remote.defaultWorkingDirectoryPlaceholder')}
          />
          <p className="text-xs text-text-muted mt-1">{t('remote.defaultWorkingDirectoryHint')}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t('remote.gatewayPort')}
          </label>
          <input
            type="number"
            value={gatewayPort}
            onChange={(e) => onGatewayPortChange(parseInt(e.target.value) || 18789)}
            className="w-full px-4 py-3 bg-surface-hover border border-border rounded-xl text-text-primary focus:border-accent focus:outline-none"
            placeholder="18789"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-hover">
          <div>
            <div className="font-medium text-text-primary text-sm">
              {t('remote.autoApproveSafeTools')}
            </div>
            <p className="text-xs text-text-muted mt-0.5">{t('remote.autoApproveSafeToolsDesc')}</p>
          </div>
          <button
            onClick={() => onAutoApproveChange(!autoApproveSafeTools)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              autoApproveSafeTools ? 'bg-accent' : 'bg-surface-active'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                autoApproveSafeTools ? 'left-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
